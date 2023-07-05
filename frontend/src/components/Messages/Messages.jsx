import React, { useContext, useEffect, useState } from 'react';
import { useParams } from "react-router-dom"
import axios from 'axios';

// components
import Sidebar from '../Home/Sidebar/Sidebar'
import ContactsBar from "../Home/ContactsBar/ContactsBar"
import Message from './Message';
import { Context } from '../Context/Context';
import OtherUsers from './OtherUsers/OtherUsers';

// styles
import "./Messages.css"

const Messages = () => {
  const { user } = useContext(Context)
  const { id } = useParams() // conversation's id
  const [conversationType,setConversationType] = useState("")
  const [messages,setMessages] = useState([]) // conversation's 
  const [otherUsers,setOtherUsers] = useState([])
  const [conversationName,setConversationName] = useState("")
  const [message,setMessage] = useState("")

  useEffect(() => {
    fetchMessages()
    fetchOtherUsers()
  },[])

  useEffect(() => {
    handleConversationName()
  },[conversationType])

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/conversations/messages/${id}`)
      console.log(response.data.type)
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
      if(message === ""){
        return
      }
      const text = message
      setMessage("")
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/sendMessage`,{
        conversationId: id,
        senderId: user.id,
        message: text
      })
    }
    catch(error){
      console.log(error)
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

        <div id='dm-messages-container'>
          {messages.map((e,i) => {
            return <Message key={i} username={e.usersId.username} image={e.usersId.image} message={e.message} created_at={e.created_at}/>
          })}
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