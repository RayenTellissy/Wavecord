import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';
import Twemoji from "react-twemoji"
import Cookies from 'js-cookie';

// components
import Sidebar from '../Home/Sidebar/Sidebar'
import ContactsBar from "../Home/ContactsBar/ContactsBar"
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
    directMessageNotifications
  } = useContext(Context)
  const { id } = useParams()
  const [messages,setMessages] = useState([])
  const [message,setMessage] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const messagesContainerRef = useRef(null)
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
    socket.emit("join_room", id) // emitting a join room event to the socket server
    scrollToBottom()
    Cookies.set("conversationChosen", JSON.stringify(conversationChosen))
    return () => {
      handleContactSwitch()
      leaveConversation()
      window.removeEventListener("beforeunload", handleUnload)
    }
  }, [id])

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
        conversationId: id,
        userId: user.id
      }, {
        withCredentials: true
      })

      // if user tries to enter a conversation he's not a part of it will redirect without fetching messages
      if (response.data.authorized === false) {
        navigate("/")
      }
      else {
        setMessages(response.data.DirectMessages)
        setIsLoading(false)
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  const scrollToBottom = () => {
    messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
  }

  const removeMessageLocally = (messageId) => {
    setMessages(messages.filter(e => e.id !== messageId))
  }

  const handleContactSwitch = () => {
    socket.emit("leave_room", id) // leaving socket room when changing conversations
    setMessages([]) // resetting messages state
    const cachedMessages = Cookies.get("cachedDirectMessages")
    if (cachedMessages) {
      var parsed = JSON.parse(cachedMessages)
      parsed[id] = currentMessage
      Cookies.set('cachedDirectMessages', JSON.stringify(parsed))
    }
    else {
      Cookies.set("cachedDirectMessages", JSON.stringify({
        [id]: currentMessage
      }))
    }
    setMessage("")
  }

  const handleCachedMessage = () => {
    const cachedMessages = Cookies.get("cachedDirectMessages")
    if (cachedMessages) {
      const parsed = JSON.parse(cachedMessages)
      if (parsed[id])
        setMessage(parsed[id])
    }
  }

  const joinConversation = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/conversations/joinConversation`, {
        conversationId: id,
        userId: user.id
      }, {
        withCredentials: true
      })
      if (directMessageNotifications && conversationHasNotification(directMessageNotifications, id)) {
        // removing notification after entering the conversation
        delete directMessageNotifications[id]
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/notifications/removeDirectMessageNotification`, {
          conversationId: id,
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
        conversationId: id,
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
        conversationId: id,
        userId: user.id
      }),
      keepalive: true,
      credentials: "include"
    })
  }

  return (
    <div id='messages-container'>
      <Sidebar />
      <ContactsBar highlighted={id} />

      <div id='dm-conversation-container'>

        <div id='messages-top-bar'>
          <OtherUsers
            image={conversationChosen.image}
            username={conversationChosen.username}
            status={conversationChosen.status}
          />
        </div>

        <div id='dm-messages-container' className='default-scrollbar' ref={messagesContainerRef}>
          {isLoading && <LoadingMessages />}
          {!isLoading && <ConversationStart username={conversationChosen.username} image={conversationChosen.image} />}
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
                conversation={id}
              />
            })}
          </Twemoji>
        </div>

        <div id='dm-conversation-input-container'>
          <MessageInput
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