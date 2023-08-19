import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import MessageInput from "../../common/MessageInput/MessageInput"
import Message from '../../Messages/Message';
import { Context } from '../../Context/Context';

// styles
import "./ChannelMessages.css"
import Topbar from '../Topbar/Topbar';

const ChannelMessages = ({ currentTextChannel, currentTextChannelId }) => {
  const { socket } = useContext(Context)
  const [messages,setMessages] = useState([])

  useEffect(() => {
    fetchMessages()
    socket.emit("join_room", currentTextChannelId)
  },[currentTextChannelId])

  useEffect(() => {
    socket.on("receive_message", data => {
      setMessages(prevMessages => [...prevMessages, data])
    })
  },[socket])

  const fetchMessages = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/fetchTextChannelMessages`,{
        channelId: currentTextChannelId
      })
      setMessages(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-messages-container'>
      <Topbar currentTextChannel={currentTextChannel}/>
      <div id='server-messages-channel-messages'>
        {messages.length !== 0 && messages.map((e,i) => {
          return <Message
            username={e.sender.username}
            image={e.sender.image}
            message={e.message}
            type="TEXT"
            created_at={e.created_at}
          />
        })}
      </div>
      <MessageInput
        setMessages={setMessages}
        conversationType="server"
        conversationName={currentTextChannel}
        channelId={currentTextChannelId}
      />
    </div>
  );
};

export default ChannelMessages;