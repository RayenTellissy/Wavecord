import React, { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useParams } from "react-router-dom"
import axios from 'axios';

// components
import Sidebar from '../Home/Sidebar/Sidebar'
import ContactsBar from "../Home/ContactsBar/ContactsBar"
import { Context } from '../Context/Context';
import OtherUsers from './OtherUsers/OtherUsers';
import GroupMessages from './GroupMessages';

// styles
import "./Messages.css"

const Messages = () => {
  const { user, socket } = useContext(Context)
  const { id } = useParams() // conversation's id
  const [conversationType,setConversationType] = useState("")
  const [messages,setMessages] = useState([])
  const [otherUsers,setOtherUsers] = useState([])
  const [conversationName,setConversationName] = useState("")
  const [message,setMessage] = useState("")
  const location = useLocation().pathname
  const scrollRef = useRef()

  useEffect(() => {
    fetchMessages() // fetching messages of the current conversation
    fetchOtherUsers() // fetching other user's details that are in this conversation
  },[])
  
  // handling conversation switching
  useEffect(() => {
    socket.emit("join_room", id) // emitting a join room event to the socket server
    fetchMessages()
    fetchOtherUsers()
  },[location])

  useEffect(() => {
    handleConversationName()
  },[otherUsers])

  // socket watching to update messages upon receiving socket
  useEffect(() => {
    socket.on("receive_message", data => {
      setMessages(prevMessages => [...prevMessages, data])
    })
  },[socket])

  // watching message updates to scroll to bottom
  useEffect(() => {
    scrollToBottom()
    scrollToBottomOnMessageUpdate()
  },[messages])

  // function to fetch messages from current conversation
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/conversations/messages/${id}`)
      setConversationType(response.data.type)
      setMessages(response.data.DirectMessages)
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
  
  // function to send a message 
  const sendMessage = async () => {
    try {
      if(message === "") return // if the no message was written nothing will happen
      const storedMessage = message
      setMessage("")
      const messageDetails = {
        conversation: id,
        usersId: { username: user.username },
        image: user.image,
        message: storedMessage,
        created_at: new Date(Date.now())
      }
      await socket.emit("send_message", messageDetails)
      setMessages(prevMessages => [...prevMessages, messageDetails])
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/sendMessage`,{
        conversationId: id,
        senderId: user.id,
        message: storedMessage
      })
    }
    catch(error){
      console.log(error)
    }
  }

  const scrollToBottom = () => {
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }

  const scrollToBottomOnMessageUpdate = () => {
    const messagesContainer = scrollRef.current
    const shouldScrollToBottom = messagesContainer.scrollTop + messagesContainer.clientHeight === messagesContainer.scrollHeight

    if (shouldScrollToBottom) {
      scrollToBottom()
    }
  }

  return (
    <div id='messages-container'>
      <Sidebar/>
      <ContactsBar highlighted={id}/>

      <div id='dm-conversation-container'>

        <div id='messages-top-bar'>
          {otherUsers.map((e,i) => {
            return <OtherUsers key={i} image={e.image} username={conversationName} status={e.status} />
          })}
        </div>

        <div id='dm-messages-container' ref={scrollRef}>
          <GroupMessages messages={messages}/>
        </div>

        <div id='dm-conversation-input-container'>
          <input id='dm-conversation-input' 
            type='text' 
            spellCheck={false}
            placeholder={`Message @${conversationName}`}  
            onChange={e => setMessage(e.target.value)}
            value={message}
          />
          <button onClick={sendMessage}>send</button>
        </div>
        
      </div>

    </div>
  );
};

export default Messages;