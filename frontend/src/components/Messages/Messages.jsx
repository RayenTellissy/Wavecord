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
  const [messages,setMessages] = useState([]) // conversation's 
  const [otherUsers,setOtherUsers] = useState([])

  useEffect(() => {
    fetchMessages()
    fetchOtherUsers()
  },[])

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/conversations/messages/${id}`)
      setMessages(response.data)
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
      console.log(response.data.users)
      setOtherUsers(response.data.users)
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
            return <OtherUsers key={i} image={e.image} username={e.username} status={e.status} />
          })}
        </div>

        {messages.map((e,i) => {
          return <Message key={i} username={e.usersId.username} image={e.usersId.image} message={e.message} created_at={e.created_at}/>
        })}
        
      </div>

    </div>
  );
};

export default Messages;