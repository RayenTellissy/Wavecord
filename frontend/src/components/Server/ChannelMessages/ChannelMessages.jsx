import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';

// components
import { Context } from '../../Context/Context';
import MessageInput from "../../common/MessageInput/MessageInput"
import Message from '../../Messages/Message';
import Roles from '../Roles/Roles';
import Topbar from "../Topbar/Topbar"
import EmptyChannel from './EmptyChannel/EmptyChannel';
import Twemoji from 'react-twemoji';

// styles
import "./ChannelMessages.css"

const ChannelMessages = ({ serverId, currentTextChannel, currentTextChannelId, user, roleColor }) => {
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
    socket.on("receive_delete_message", data => {
      setMessages(prevMessages => prevMessages.filter(message => message.id !== data.messageId))
    })
    return () => {
      socket.off("receive_message")
      socket.off("receive_delete_message")
    }
  },[socket])

  useEffect(() => {
    scrollToBottom()
  },[messages])

  const fetchMessages = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/fetchTextChannelMessages`,{
        channelId: currentTextChannelId,
        serverId
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
            <div id='server-messages-channel-messages' ref={messagesContainerRef}>
              <EmptyChannel channelName={currentTextChannel}/>
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
                    usernameColor={e.sender.UsersInServers[0].role?.color}
                    conversation={currentTextChannelId}
                    socket={socket}
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
                roleColor={roleColor}
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