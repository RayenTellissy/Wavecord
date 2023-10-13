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
import MessagesLoader from '../../common/MessagesLoader/MessagesLoader';
import MessagesSpinner from '../../common/MessagesSpinner/MessagesSpinner';

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
  const [messages,setMessages] = useState(null)
  const [message,setMessage] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [amount,setAmount] = useState(15)
  const [hasMore,setHasMore] = useState(null)
  const [loadedMore,setLoadedMore] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  var isScrolling = false // used for debounce

  useEffect(() => {
    messagesContainerRef.current.addEventListener("scroll", debounceScroll)
    handleCachedMessage()
    fetchMessages()
    socket.emit("join_room", currentTextChannelId)
    return () => {
      handleChannelSwitch()
      if(messagesContainerRef.current){
        messagesContainerRef.current.removeEventListener("scroll", debounceScroll)
      }
    }
  },[currentTextChannelId])

  useEffect(() => {
    if(!isLoading){
      fetchMessages()
    }
  }, [amount])

  useEffect(() => {
    console.log(hasMore, messages)
  }, [hasMore, messages])

  useEffect(() => {
    // storing state to cache in cookies
    currentMessage = message
  }, [message])

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
  }, [socket])

  useEffect(() => {
    if(messages && messages.length){
      scrollToBottom()
    }
  }, [messages])

  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/fetchTextChannelMessages`,{
        channelId: currentTextChannelId,
        serverId,
        amount
      }, {
        withCredentials: true
      })
      setMessages(response.data.messages)
      setHasMore(response.data.hasMore)
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const scrollToBottom = () => {
    if(loadedMore) return
    const cookie = Cookies.get("textChannelsCachedScroll")
    // if the ref height is not the same (the user has new messages) scroll to bottom
    if(cookie
        && JSON.parse(cookie)[serverId]
        && JSON.parse(cookie)[serverId][currentTextChannelId]
        && JSON.parse(cookie)[serverId][currentTextChannelId].lastHeight === messagesContainerRef.current.scrollHeight
      ){
      applyCachedScroll()
    }
    else {
      messagesEndRef.current.scrollIntoView()
    }
  }

  const applyCachedScroll = () => {
    const cookie = Cookies.get("textChannelsCachedScroll")
    // if the user has a saved scroll value it will scroll him to the saved value
    if(cookie){
      const parsed = JSON.parse(cookie)
      if(parsed[serverId] && parsed[serverId][currentTextChannelId]){
        messagesContainerRef.current.scrollTop = parsed[serverId][currentTextChannelId].savedScroll
      }
    }
  }

  const handleScroll = () => {
    if(isLoading) return
    const cookie = Cookies.get("textChannelsCachedScroll")
    if(!cookie){
      return Cookies.set("textChannelsCachedScroll", JSON.stringify({
        [serverId]: {
          [currentTextChannelId]: {
            lastHeight: messagesContainerRef.current.scrollHeight,
            savedScroll: messagesContainerRef.current.scrollTop
          }
        }
      }), { expires: 7 })
    }
    var parsed = JSON.parse(cookie)
    if(!parsed[serverId]){
      parsed[serverId] = {}
    }
    parsed[serverId][currentTextChannelId] = {
      lastHeight: messagesContainerRef.current.scrollHeight,
      savedScroll: messagesContainerRef.current.scrollTop
    }
    Cookies.set("textChannelsCachedScroll", JSON.stringify(parsed), { expires: 7 })
  }

  // using debounce for scroll performance
  const debounceScroll = () => {
    if(!isScrolling){
      isScrolling = true
      setTimeout(() => {
        handleScroll()
        isScrolling = false
      }, 1000)
    } 
  }

  // function used to remove the messages visually instantly for the user when he removes a message
  const removeMessageLocally = (messageId) => {
    setMessages(messages.filter(e => e.id !== messageId))
  }

  // function that resets certain states and features when the user switches the channel
  const handleChannelSwitch = () => {
    socket.emit("leave_room", currentTextChannelId)
    setMessages(null) // resetting state
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

  // function to store draft messages the the user has written, so if he leaves the conversation and comes back he doesn't
  // need to rewrite the messages
  const handleCachedMessage = () => {
    const cachedMessages = Cookies.get("cachedServerMessages")
    if(cachedMessages){
      const parsed = JSON.parse(cachedMessages)
      if(parsed[currentTextChannelId]){
        setMessage(parsed[currentTextChannelId])
      }
    }
  }

  const loadMore = async () => {
    setLoadedMore(true)
    setAmount(prevAmount => prevAmount + 10)
  }

  return (
    <>
      <div id='server-messages-container'>
        <div id='server-content-container'>
          <div id='server-content-main'>
            <Topbar currentTextChannel={currentTextChannel}/>
            <div
              id='server-messages-channel-messages'
              className='default-scrollbar'
              ref={messagesContainerRef}
            >
              {!messages && <MessagesSpinner />}
              {(messages && !hasMore) && <EmptyChannel channelName={currentTextChannel} />}
              {(messages && hasMore) && <MessagesLoader loadMore={loadMore} isFetching={isLoading} />}
              <Twemoji options={{ className: 'twemoji' }}>
                {messages && messages.length !== 0 && messages.map((e,i) => {
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