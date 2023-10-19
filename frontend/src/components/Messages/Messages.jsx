import React, { useContext, useEffect, useRef, useState } from 'react';
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
import MessagesSpinner from '../common/MessagesSpinner/MessagesSpinner';

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
  const [blockedConversation,setBlockedConversation] = useState(null)
  const messagesRef = useRef(messages)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
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
    if(messages){
      fetchMessages()
    }
  }, [amount])

  useEffect(() => {
    console.log(blockedConversation)
  }, [blockedConversation])
  
  // handling conversation switching
  useEffect(() => {
    window.addEventListener("beforeunload", handleUnload)
    messagesContainerRef.current.addEventListener("scroll", debounceScroll)
    joinConversation()
    fetchMessages()
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
    socket.on("receive_edit_message", data => {
      editMessageLocally(data.messageId, data.editedMessage)
    })
    return () => {
      socket.off("receive_message")
      socket.off("receive_delete_message")
      socket.off("receive_edit_message")
    }
  }, [socket])

  useEffect(() => {
    messagesRef.current = messages
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
      setMessages(response.data.DirectMessages)
      setHasMore(response.data.hasMore)
      setBlockedConversation(response.data.blockedConversation)
      setIsLoading(false)
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

  // function that resets certain states and features when the user switches the conversation
  const handleContactSwitch = () => {
    socket.emit("leave_room", currentConversationId) // leaving socket room when changing conversations
    setMessages(null) // resetting messages state
    setHasMore(null)
    setAmount(15)
    setLoadedMore(false)
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

  // function to store draft messages the the user has written, so if he leaves the conversation and comes back he doesn't
  // need to rewrite the messages
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
  const loadMore = () => {
    setLoadedMore(true)
    setAmount(prevAmount => prevAmount + 10)
    
  }

  const editMessageLocally = (messageId, newMessage) => {
    var messagesCopy = [...messagesRef.current]
    const index = messagesCopy.findIndex(e => e.id === messageId)
    if(index !== -1){
      messagesCopy[index].message = newMessage
      messagesCopy[index].edited = true
      setMessages(messagesCopy)
    }
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

        <div id='dm-messages-container' className='default-scrollbar' ref={messagesContainerRef}>
          {!messages && <MessagesSpinner />}
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
                edited={e.edited}
                type={e.type}
                created_at={e.created_at}
                conversationType="dm"
                removeMessageLocally={removeMessageLocally}
                editMessageLocally={editMessageLocally}
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
            conversationType="dm"
            user={user}
            blockedConversation={blockedConversation}
          />
        </div>

      </div>

    </div>
  );
};

export default Messages;