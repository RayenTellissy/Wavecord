import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';
import Twemoji from "react-twemoji"
import Cookies from 'js-cookie';

// components
import Sidebar from '../Home/Sidebar/Sidebar'
import ContactsBar from "../Home/ContactsBar/ContactsBar"
import { Context } from '../Context/Context';
import OtherUsers from './OtherUsers/OtherUsers';
import Message from "./Message"
import LoadingMessages from "./LoadingMessages/LoadingMessages"
import MessageInput from '../common/MessageInput/MessageInput';
import ConversationStart from './ConversationStart/ConversationStart';

// styles
import "./Messages.css"

const Messages = () => {
  const { user, socket, conversationChosen, setConversationChosen } = useContext(Context)
  const { id } = useParams()
  const [messages,setMessages] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const messagesContainerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if(!conversationChosen){
      setConversationChosen(JSON.parse(Cookies.get("conversationChosen")))
    }
  },[])
  
  // handling conversation switching
  useEffect(() => {
    fetchMessages()
    socket.emit("join_room", id) // emitting a join room event to the socket server
    scrollToBottom()
    Cookies.set("conversationChosen", JSON.stringify(conversationChosen), { expires: 1 })
  },[id])
  
  // socket watching to update messages upon receiving socket
  useEffect(() => {
    socket.on("receive_message", data => {
      setMessages(prevMessages => [...prevMessages, data])
    })
  },[socket])

  useEffect(() => {
    scrollToBottom()
  },[messages])

  // function to fetch messages from current conversation
  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/messages`,{
        conversationId: id,
        userId: user.id
      })

      // if user tries to enter a conversation he's not a part of it will redirect without fetching messages
      if(response.data.authorized === false){
        navigate("/")
      }
      setMessages(response.data.DirectMessages)
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }

  const removeMessageLocally = (messageId) => {
    setMessages(messages.filter(e => e.id !== messageId))
  }

  return (
    <div id='messages-container'>
      <Sidebar/>
      <ContactsBar highlighted={id}/>

      <div id='dm-conversation-container'>

        <div id='messages-top-bar'>
          <OtherUsers 
            image={conversationChosen.image}
            username={conversationChosen.username}
            status={conversationChosen.status} 
          />
        </div>

        <div id='dm-messages-container' ref={messagesContainerRef}>
          {isLoading && <LoadingMessages/>}
          <ConversationStart username={conversationChosen.username} image={conversationChosen.image}/>
          <Twemoji options={{ className: 'twemoji' }}>
            {messages.length !== 0 && messages.map((e,i) => {
              return <Message
                key={i}
                id={e.id}
                isSender={user.id === e.sender.id}
                senderId={e.sender.id}
                username={e.sender.username} 
                image={e.sender.image} 
                message={e.message}
                type={e.type}
                created_at={e.created_at}
                conversationType="dm"
                removeMessageLocally={removeMessageLocally}
              />
            })}
          </Twemoji>
        </div>

        <div id='dm-conversation-input-container'>
          <MessageInput
            conversationName={conversationChosen.username}
            setMessages={setMessages}
            scrollToBottom={scrollToBottom}
            conversationType="dm"
            user={user}
          />
        </div>
        
      </div>

    </div>
  );
};

export default Messages;