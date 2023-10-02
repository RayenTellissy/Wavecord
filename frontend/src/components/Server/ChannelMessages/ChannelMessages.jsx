import React, { useContext, useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"
import Twemoji from 'react-twemoji';

// components
import { Context } from '../../Context/Context';
import MessageInput from "../../common/MessageInput/MessageInput"
import Message from '../../Messages/Message';
import Roles from '../Roles/Roles';
import Topbar from "../Topbar/Topbar"
import EmptyChannel from './EmptyChannel/EmptyChannel';
import LoadingMessages from '../../Messages/LoadingMessages/LoadingMessages';

// styles
import "./ChannelMessages.css"

// caching state
var currentMessage = ""

const ChannelMessages = ({
  serverId,
  currentTextChannel,
  currentTextChannelId,
  roleColor
}) => {
  const { user, socket } = useContext(Context)
  const [messages,setMessages] = useState([])
  const [message,setMessage] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [showStart,setShowStart] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    handleCachedMessage()
    fetchMessages()
    socket.emit("join_room", currentTextChannelId)
    scrollToBottom()
    return () => handleChannelSwitch()
  },[currentTextChannelId])

  useEffect(() => {
    // storing state to cache in cookies
    currentMessage = message
  },[message])

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
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/fetchTextChannelMessages`,{
        channelId: currentTextChannelId,
        serverId
      }, {
        withCredentials: true
      })
      setMessages(response.data)
      setShowStart(true)
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView()
  }

  const removeMessageLocally = (messageId) => {
    setMessages(messages.filter(e => e.id !== messageId))
  }

  const handleChannelSwitch = () => {
    socket.emit("leave_room", currentTextChannelId)
    setShowStart(false)
    setMessages([]) // resetting state
    const cachedMessages = Cookies.get("cachedServerMessages")
    if(cachedMessages){
      var parsed = JSON.parse(cachedMessages)
      parsed[currentTextChannelId] = currentMessage
      Cookies.set("cachedServerMessages", JSON.stringify(parsed))
    }
    else {
      Cookies.set("cachedServerMessages", JSON.stringify({
        [currentTextChannelId]: currentMessage
      }))
    }
    setMessage("")
  }

  const handleCachedMessage = () => {
    const cachedMessages = Cookies.get("cachedServerMessages")
    if(cachedMessages){
      const parsed = JSON.parse(cachedMessages)
      if(parsed[currentTextChannelId]){
        setMessage(parsed[currentTextChannelId])
      }
    }
  }

  return (
    <>
      <div id='server-messages-container'>
        <div id='server-content-container'>
          <div id='server-content-main'>
            <Topbar currentTextChannel={currentTextChannel}/>
            <div id='server-messages-channel-messages' className='default-scrollbar'>
              {isLoading && <LoadingMessages/>}
              {showStart && <EmptyChannel channelName={currentTextChannel}/>}
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
                    usernameColor={e.sender.UsersInServers[0]?.role?.color}
                    conversation={currentTextChannelId}
                  />
                })}
                <div ref={messagesEndRef}/>
              </Twemoji>
            </div>
            <div id='server-message-input-container'>
              <MessageInput
                message={message}
                setMessage={setMessage}
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