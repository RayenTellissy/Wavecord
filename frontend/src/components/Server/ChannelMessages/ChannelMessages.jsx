import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

// components
import MessageInput from "../../common/MessageInput/MessageInput"
import Message from '../../Messages/Message';
import { Context } from '../../Context/Context';
import Topbar from '../Topbar/Topbar';
import Roles from '../Roles/Roles';

// styles
import "./ChannelMessages.css"

const ChannelMessages = ({ currentTextChannel, currentTextChannelId }) => {
  const { socket } = useContext(Context)
  const [messages,setMessages] = useState([])
  const messagesContainerRef = useRef(null)

  useEffect(() => {
    fetchMessages()
    socket.emit("join_room", currentTextChannelId)
    scrollToBottom()
  },[currentTextChannelId])

  useEffect(() => {
    socket.on("receive_message", data => {
      setMessages(prevMessages => [...prevMessages, data])
    })
  },[socket])

  useEffect(() => {
    scrollToBottom()
  },[messages])

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

  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }

  return (
    <div id='server-messages-container'>
      <Topbar currentTextChannel={currentTextChannel}/>
      <div id='ksabndkubasdiuka'>
        <div id='sakjdbjas'>
          <div id='server-messages-channel-messages' ref={messagesContainerRef} >
            {messages.length !== 0 && messages.map((e,i) => {
              return <Message
              key={i}
              username={e.sender.username}
              image={e.sender.image}
              message={e.message}
              type="TEXT"
              created_at={e.created_at}
              />
            })}
          </div>
          <div>
            <MessageInput
              setMessages={setMessages}
              conversationType="server"
              conversationName={currentTextChannel}
              channelId={currentTextChannelId}
            />
          </div>
        </div>
        <Roles/>
      </div>
    </div>
  );
};

export default ChannelMessages;