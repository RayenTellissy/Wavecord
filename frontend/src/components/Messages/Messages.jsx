import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import Twemoji from "react-twemoji"
import Cookies from 'js-cookie';

// components
import { Context } from '../Context/Context';
import OtherUsers from './OtherUsers/OtherUsers';
import Message from "./Message"
import MessageInput from '../common/MessageInput/MessageInput';
import ConversationStart from './ConversationStart/ConversationStart';
import MessagesLoader from '../common/MessagesLoader/MessagesLoader';

// styles
import "./Messages.css"

// helper functions
import sortConversations from '../../utils/Helper/sortConversations';
import { conversationHasNotification } from '../../utils/Helper/notificationHelpers';

// caching state
var currentMessage = ""

const Messages = () => {
  const {
    user,
    socket,
    conversations,
    conversationChosen,
    setConversationChosen,
    directMessageNotifications,
    setDirectMessageNotifications,
    currentConversationId
  } = useContext(Context)
  const [messages,setMessages] = useState(null)
  const [message,setMessage] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [amount,setAmount] = useState(15)
  const [hasMore,setHasMore] = useState(null)
  const [loadedMore,setLoadedMore] = useState(false)
  const [appliedScroll,setAppliedScroll] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const navigate = useNavigate()
  var isScrolling = false

  useEffect(() => {
    if(!conversationChosen){
      setConversationChosen(JSON.parse(Cookies.get("conversationChosen")))
    }
    return () => {
      Cookies.remove("conversationChosen")
    }
  }, [])

  useEffect(() => {
    if(!isLoading){
      fetchMessages()
    }
  }, [amount])
  
  // handling conversation switching
  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload)
    messagesContainerRef.current.addEventListener("scroll", debounceScroll)
    joinConversation()
    handleCachedMessage()
    socket.emit("join_room", currentConversationId) // emitting a join room event to the socket server
    Cookies.set("conversationChosen", JSON.stringify(conversationChosen))
    return () => {
      handleContactSwitch()
      leaveConversation()
      window.removeEventListener("beforeunload", handleUnload)
      if(messagesContainerRef.current){
        messagesContainerRef.current.removeEventListener("scroll", debounceScroll)
      }
    }
  }, [currentConversationId])

  // socket watching to update messages upon receiving socket
  useEffect(() => {
    socket.on("receive_message", data => {
      sortConversations(data.conversation, conversations)
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

  useEffect(() => {
    currentMessage = message
  }, [message])

  // function to fetch messages from current conversation
  const fetchMessages = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/messages`, {
        conversationId: currentConversationId,
        userId: user.id,
        amount
      }, {
        withCredentials: true
      })
      
      // if user tries to enter a conversation he's not a part of it will redirect without fetching messages
      if (response.data.authorized === false) {
        navigate("/404")
      }
      else {
        setMessages(response.data.DirectMessages)
        setHasMore(response.data.hasMore)
        setIsLoading(false)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const scrollToBottom = () => {
    if(loadedMore) return
    const cookie = Cookies.get("conversationsCachedScroll")
    // if the ref height is not the same (the user has new messages) scroll to bottom
    if(
        cookie
        && JSON.parse(cookie)[currentConversationId]
        && JSON.parse(cookie)[currentConversationId].lastHeight === messagesContainerRef.current.scrollHeight)
      {
      applyCachedScroll()
    }
    else {
      // scroll to bottom
      messagesEndRef.current.scrollIntoView()
    }
    setAppliedScroll(true)
  }

  const applyCachedScroll = () => {
    const cookie = Cookies.get("conversationsCachedScroll")
    // if the user has a saved scroll value it will scroll him to the saved value
    if(cookie){
      const parsed = JSON.parse(cookie)
      if(parsed[currentConversationId]){
        messagesContainerRef.current.scrollTop = parsed[currentConversationId].savedScroll
      }
    }
  }

  // function to cache where the user has scrolled in a conversation
  const handleScroll = () => {
    if(isLoading) return
    const cookie = Cookies.get("conversationsCachedScroll")
    if(!cookie){
      return Cookies.set("conversationsCachedScroll", JSON.stringify({
        [currentConversationId]: {
          lastHeight: messagesContainerRef.current.scrollHeight,
          savedScroll: messagesContainerRef.current.scrollTop
        }
      }), { expires: 7 })
    }
    var parsed = JSON.parse(cookie)
    parsed[currentConversationId] = {
      lastHeight: messagesContainerRef.current.scrollHeight,
      savedScroll: messagesContainerRef.current.scrollTop
    }
    Cookies.set("conversationsCachedScroll", JSON.stringify(parsed), { expires: 7 })
  }

  // using debounce for scroll performance
  const debounceScroll = () => {
    // if(hasMore) {
    //   if(messagesContainerRef.current.scrollTop < 100){
    //     loadMore()
    //   }
    // }
    if(!isScrolling){
      isScrolling = true
      setTimeout(() => {
        handleScroll()
        isScrolling = false
      }, 1000)
    } 
  }

  const forceScrollBottom = () => {
    messagesEndRef.current.scrollIntoView()
  }

  const removeMessageLocally = (messageId) => {
    setMessages(messages.filter(e => e.id !== messageId))
  }

  const handleContactSwitch = () => {
    socket.emit("leave_room", currentConversationId) // leaving socket room when changing conversations
    setMessages(null) // resetting messages state
    setHasMore(null)
    const cachedMessages = Cookies.get("cachedDirectMessages")
    if (cachedMessages) {
      var parsed = JSON.parse(cachedMessages)
      parsed[currentConversationId] = currentMessage
      Cookies.set('cachedDirectMessages', JSON.stringify(parsed))
    }
    else {
      Cookies.set("cachedDirectMessages", JSON.stringify({
        [currentConversationId]: currentMessage
      }))
    }
    setMessage("")
  }

  const handleCachedMessage = () => {
    const cachedMessages = Cookies.get("cachedDirectMessages")
    if (cachedMessages) {
      const parsed = JSON.parse(cachedMessages)
      if (parsed[currentConversationId])
        setMessage(parsed[currentConversationId])
    }
  }

  const joinConversation = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/conversations/joinConversation`, {
        conversationId: currentConversationId,
        userId: user.id
      }, {
        withCredentials: true
      })
      // if conversation has notifications, they will be removed
      if (directMessageNotifications && conversationHasNotification(directMessageNotifications, currentConversationId)) {
        // removing notifications locally from state
        setDirectMessageNotifications((prevNotifications) => {
          const { [currentConversationId]: removedNotification, ...restNotifications } = prevNotifications
          return restNotifications
        })
        // removing notifications in the database
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/notifications/removeDirectMessageNotification`, {
          conversationId: currentConversationId,
          recipientId: user.id
        }, {
          withCredentials: true
        })
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const leaveConversation = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/conversations/leaveConversation`, {
        conversationId: currentConversationId,
        userId: user.id
      }, {
        withCredentials: true
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleUnload = () => {
    fetch(`${import.meta.env.VITE_SERVER_URL}/conversations/leaveConversation`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        conversationId: currentConversationId,
        userId: user.id
      }),
      keepalive: true,
      credentials: "include"
    })
  }

  // function used for lazy loading messages
  const loadMore = async () => {
    setLoadedMore(true)
    setAmount(prevAmount => prevAmount + 5)
  }

  return (
    <div id='messages-container'>
      <div id='dm-conversation-container'>

        <div id='messages-top-bar'>
          <OtherUsers
            image={conversationChosen.image}
            username={conversationChosen.username}
            status={conversationChosen.status}
          />
        </div>

        <div style={{ opacity: appliedScroll ? "100%" : "0%" }} id='dm-messages-container' className='default-scrollbar' ref={messagesContainerRef}>
          {/* {isLoading && <LoadingMessages />} */}
          {(messages && !hasMore) && <ConversationStart username={conversationChosen.username} image={conversationChosen.image} />}
          {(messages && hasMore) && <MessagesLoader loadMore={loadMore} isFetching={isLoading} />}
          <Twemoji options={{ className: 'twemoji' }}>
            {messages && messages.length !== 0 && messages.map((e, i) => {
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
                conversationType="dm"
                removeMessageLocally={removeMessageLocally}
                conversation={currentConversationId}
              />
            })}
            <div ref={messagesEndRef}/>
          </Twemoji>
        </div>

        <div id='dm-conversation-input-container'>
          <MessageInput
            channelId={currentConversationId}
            message={message}
            setMessage={setMessage}
            conversationName={conversationChosen.username}
            setMessages={setMessages}
            forceScrollBottom={forceScrollBottom}
            conversationType="dm"
            user={user}
          />
        </div>

      </div>

    </div>
  );
};

export default Messages;