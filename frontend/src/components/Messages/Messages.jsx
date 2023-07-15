import React, { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from "react-router-dom"
import axios from 'axios';

// components
import Sidebar from '../Home/Sidebar/Sidebar'
import ContactsBar from "../Home/ContactsBar/ContactsBar"
import { Context } from '../Context/Context';
import OtherUsers from './OtherUsers/OtherUsers';
import GroupMessages from './GroupMessages';
import LoadingMessages from "./LoadingMessages/LoadingMessages"

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
  const [message,setMessage] = useState("")
  const messagesContainerRef = useRef(null)
  
  useEffect(() => {
    fetchOtherUsers() // fetching other user's details that are in this conversation
    fetchMessages() // fetching messages of the current conversation
  },[])
  
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
  
  // function to send a message 
  const sendMessage = async () => {
    try {
      if(message === "") return // if the no message was written nothing will happen
      const storedMessage = message
      setMessage("")

      const messageDetails = {
        conversation: id,
        usersId: { 
          username: user.username,
          image: user.image
        },
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
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }

  return (
    <div id='messages-container'>
      <Sidebar/>
      <ContactsBar highlighted={id}/>

      <div id='dm-conversation-container'>

        <div id='messages-top-bar'>
          {!isLoading && otherUsers.map((e,i) => {
            return <OtherUsers key={i} image={e.image} username={conversationName} status={e.status} />
          })}
        </div>

        <div id='dm-messages-container' ref={messagesContainerRef}>
          {isLoading && <LoadingMessages/>}
          {messages.length !== 0 && <GroupMessages
            messages={messages} 
            setIsLoading={setIsLoading}
          />}
        </div>

        <div id='dm-conversation-input-container'>
          <input id='dm-conversation-input'
            type='text'
            spellCheck={false}
            placeholder={`Message @${conversationName}`}
            onChange={e => setMessage(e.target.value)}
            value={message}
            onKeyDown={e => {
              e.key === "Enter" && sendMessage()
            }}
            autoFocus
          />
        </div>
        
      </div>

    </div>
  );
};

export default Messages;