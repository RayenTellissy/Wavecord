import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

// components
import { Context } from '../../Context/Context';
import MessageInput from "../../common/MessageInput/MessageInput"
import Message from '../../Messages/Message';
import Roles from '../Roles/Roles';
import Topbar from "../Topbar/Topbar"

// styles
import "./ChannelMessages.css"
import Twemoji from 'react-twemoji';

const ChannelMessages = ({ serverId, currentTextChannel, currentTextChannelId, user }) => {
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

  const removeMessageLocally = (messageId) => {
    setMessages(messages.filter(e => e.id !== messageId))
  }

  return (
    <>
      <div id='server-messages-container'>
        <div id='server-content-container'>
          <div id='server-content-main'>
            <Topbar currentTextChannel={currentTextChannel}/>
            <div id='server-messages-channel-messages' ref={messagesContainerRef} >
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
                    conversationType="server"
                    removeMessageLocally={removeMessageLocally}
                  />
                })}
              </Twemoji>
            </div>
            <div id='server-message-input-container'>
              <MessageInput
                setMessages={setMessages}
                conversationType="server"
                conversationName={currentTextChannel}
                channelId={currentTextChannelId}
                user={user}
              />
            </div>
          </div>
          <Roles serverId={serverId}/>
        </div>
      </div>
    </>
  );
};

export default ChannelMessages;