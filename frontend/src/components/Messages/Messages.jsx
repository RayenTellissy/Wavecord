import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom"

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
      console.log(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div>
      {messages.map((e,i) => {
        return <p>{e.usersId.username} {e.message} {e.created_at}</p>
      })}
    </div>
  );
};

export default Messages;