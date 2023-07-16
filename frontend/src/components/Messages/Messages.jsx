import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom"
import axios from 'axios';
import Twemoji from "react-twemoji"

// components
import Sidebar from '../Home/Sidebar/Sidebar'
import ContactsBar from "../Home/ContactsBar/ContactsBar"
import { Context } from '../Context/Context';
import OtherUsers from './OtherUsers/OtherUsers';
import Message from "./Message"
import LoadingMessages from "./LoadingMessages/LoadingMessages"
import MessageInput from '../common/MessageInput/MessageInput';

// styles
import "./Messages.css"

const Messages = () => {
  const { user, socket } = useContext(Context)
  const { id } = useParams() // conversation's id
  const [conversationType,setConversationType] = useState("")
  const [messages,setMessages] = useState([])
  const [otherUsers,setOtherUsers] = useState([])
  const [conversationName,setConversationName] = useState("")
  const [isLoading,setIsLoading] = useState(true)
  const messagesContainerRef = useRef(null)
  
  // handling conversation switching
  useEffect(() => {
    socket.emit("join_room", id) // emitting a join room event to the socket server
    fetchOtherUsers()
    fetchMessages()
    scrollToBottom()
  },[id])

  useEffect(() => {
    handleConversationName()
  },[otherUsers])

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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/conversations/messages/${id}`,{
        withCredentials: true
      })
      setConversationType(response.data.type)
      setMessages(response.data.DirectMessages)
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const fetchOtherUsers = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/fetchOtherUsers`,{
        conversationId: id,
        userId: user.id
      },{
        withCredentials: true
      })
      setOtherUsers(response.data.users)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleConversationName = () => {
    if(conversationType === "DIRECT"){
      setConversationName(otherUsers[0].username)
    }
  }

  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }

  return (
    <div id='messages-container'>
      <Sidebar/>
      <ContactsBar highlighted={id}/>

      <div id='dm-conversation-container'>

        <div id='messages-top-bar'>
          {!isLoading && otherUsers.map((e,i) => {
            return <OtherUsers 
              key={i} 
              image={e.image} 
              username={conversationName} 
              status={e.status} 
            />
          })}
        </div>

        <div id='dm-messages-container' ref={messagesContainerRef}>
          {isLoading && <LoadingMessages/>}
          <Twemoji options={{ className: 'twemoji' }}>
            {messages.length !== 0 && messages.map((e,i) => {
              return <Message 
                key={i}
                username={e.usersId.username} 
                image={e.usersId.image} 
                message={e.message}
                type={e.type}
                created_at={e.created_at}
              />
            })}
          </Twemoji>
        </div>

        <div id='dm-conversation-input-container'>
          <MessageInput
            conversationName={conversationName}
            setMessages={setMessages}
            scrollToBottom={scrollToBottom}
          />
        </div>
        
      </div>

    </div>
  );
};

export default Messages;