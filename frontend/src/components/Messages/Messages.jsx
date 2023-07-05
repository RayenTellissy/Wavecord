import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"

// components
import Sidebar from '../Home/Sidebar/Sidebar'
import ContactsBar from "../Home/ContactsBar/ContactsBar"
import Message from './Message';

// styles
import "./Messages.css"

const Messages = () => {
  const { id } = useParams()
  const [messages,setMessages] = useState([])

  useEffect(() => {
    fetchMessages()
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

  return (
    <div id='messages-container'>
      <Sidebar/>
      <ContactsBar/>

      <div id='dm-conversation-container'>
      <div id='messages-top-bar'>
      </div>
        {messages.map((e,i) => {
          return <Message key={i} username={e.usersId.username} image={e.usersId.image} message={e.message} created_at={e.created_at}/>
        })}
      </div>

    </div>
  );
};

export default Messages;