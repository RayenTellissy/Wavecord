import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from "react-router-dom"
import axios from 'axios';
import Twemoji from "react-twemoji"
import Cookies from 'js-cookie';

// components
import { Context } from '../Context/Context';
import OtherUsers from './OtherUsers/OtherUsers';
import Message from "./Message"
import LoadingMessages from "./LoadingMessages/LoadingMessages"
import MessageInput from '../common/MessageInput/MessageInput';
import ConversationStart from './ConversationStart/ConversationStart';

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
    currentConversationId
  } = useContext(Context)
  const [messages,setMessages] = useState([])
  const [message,setMessage] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [showStart,setShowStart] = useState(false)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if(!conversationChosen){
      setConversationChosen(JSON.parse(Cookies.get("conversationChosen")))
    }
    return () => {
      Cookies.remove("conversationChosen")
    }
  }, [])
  
  // handling conversation switching
  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload)
    joinConversation()
    handleCachedMessage()
    fetchMessages()
    socket.emit("join_room", currentConversationId) // emitting a join room event to the socket server
    scrollToBottom()
    Cookies.set("conversationChosen", JSON.stringify(conversationChosen))
    return () => {
      handleContactSwitch()
      leaveConversation()
      window.removeEventListener("beforeunload", handleUnload)
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
    scrollToBottom()
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
        userId: user.id
      }, {
        withCredentials: true
      })

      // if user tries to enter a conversation he's not a part of it will redirect without fetching messages
      if (response.data.authorized === false) {
        navigate("/404")
      }
      else {
        setMessages(response.data.DirectMessages)
        setShowStart(true)
        setIsLoading(false)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView()
  }

  const removeMessageLocally = (messageId) => {
    setMessages(messages.filter(e => e.id !== messageId))
  }

  const handleContactSwitch = () => {
    socket.emit("leave_room", currentConversationId) // leaving socket room when changing conversations
    setShowStart(false)
    setMessages([]) // resetting messages state
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
      if (directMessageNotifications && conversationHasNotification(directMessageNotifications, currentConversationId)) {
        // removing notification after entering the conversation
        delete directMessageNotifications[currentConversationId]
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

        <div id='dm-messages-container' className='default-scrollbar'>
          {isLoading && <LoadingMessages />}
          {showStart && <ConversationStart username={conversationChosen.username} image={conversationChosen.image} />}
          <Twemoji options={{ className: 'twemoji' }}>
            {messages.length !== 0 && messages.map((e, i) => {
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
            scrollToBottom={scrollToBottom}
            conversationType="dm"
            user={user}
          />
        </div>

      </div>

    </div>
  );
};

export default Messages;