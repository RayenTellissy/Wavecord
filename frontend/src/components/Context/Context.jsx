import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"
import Cookies from "js-cookie"

export const Context = createContext()

// hooks
import useMic from "../../hooks/useMic";
import useConversation from "../../hooks/useConversation"

// helper functions
import returnServerIds from "../../utils/Helper/returnServerId";
import { createFriendRequestNotification, createDirectMessageNotification } from "../../utils/Helper/createNotification"
import { returnFriendsIds } from "../../utils/Helper/friendsHelpers";

export const ContextProvider = ({ children }) => {
  const [user,setUser] = useState({ loggedIn: null })
  const [socket,setSocket] = useState(null)
  const [conversations,setConversations] = useState([])
  const [constantConversations,setConstantConversations] = useState([])
  const [conversationsLoading,setConversationsLoading] = useState(true)
  const [conversationChosen,setConversationChosen] = useConversation()
  const [micEnabled,setMicEnabled] = useMic()
  const [deafened,setDeafened] = useState(false)
  const [cameraEnabled,setCameraEnabled] = useState(false)
  const [isSpeaking,setIsSpeaking] = useState(false)
  const [selectScreenShare,setSelectScreenShare] = useState(false)
  const [screenShareEnabled,setScreenShareEnabled] = useState(false)
  const [connectionQuality,setConnectionQuality] = useState(null)
  const [connectionState,setConnectionState] = useState("")
  const [displayRoom,setDisplayRoom] = useState(false)
  const [status,setStatus] = useState("")
  const [currentVoiceChannelId,setCurrentVoiceChannelId] = useState("")
  const [servers,setServers] = useState([])
  const [token,setToken] = useState("")
  const [serversLoading,setServersLoading] = useState(true)
  const [directMessageNotifications,setDirectMessageNotifications] = useState(null)
  const [friendRequestNotifications,setFriendRequestNotifications] = useState(null)
  const [currentConversationId,setCurrentConversationId] = useState("")
  const [currentServerId,setCurrentServerId] = useState("")
  const [display,setDisplay] = useState("")
  const [selected,setSelected] = useState("Friends")
  const [notificationsEnabled,setNotificationsEnabled] = useState({})

  useEffect(() => {
    authenticateSession()
    handleSocket()
    handleNotificationSettings()
    return () => window.removeEventListener("beforeunload", handleDisconnect)
  },[])


  useEffect(() => {
    if(socket){
      // if status has not been set, invoke connection handler function
      if(user.id){
        handleConnect()
        fetchServers()
        fetchConversations()
        fetchNotifications()
        cacheFriends()
        socket.on("receive_friend_request_notification", data => {
          fetchFriendRequestNotifications()
          // activate notification sound
          document.getElementById("wavecord-default-notification-sound").click()
          createFriendRequestNotification({
            username: data.username,
            image: data.image
          })
        })
        socket.on("receive_direct_message_notification", data => {
         const navigateToConversation = () => {
            setConversationChosen({ id: data.id, username: data.username, image: data.image, status: data.status })
            setCurrentConversationId(data.conversationId)
            setDisplay("directMessages")
          }
          // activate notification sound
          document.getElementById("wavecord-default-notification-sound").click()
          createDirectMessageNotification({
            username: data.username,
            image: data.image,
            message: data.message,
            callback: navigateToConversation
          })
        })
      } 
      window.addEventListener("beforeunload", handleDisconnect)
    }
  },[socket, user])

  // function to retrieve all the current user's information
  const authenticateSession = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
        withCredentials: true
      })
      setUser(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  // function to create the socket.io client
  const handleSocket = async () => {
    const socket = await io.connect(import.meta.env.VITE_SOCKET_URL)
    setSocket(socket)
  }
  
  // function to be invoked when user runs the app. (status handler)
  const handleConnect = async () => {
    if(socket){
      // session for notifications
      socket.emit("start_session", {
        id: user.id
      })
      // custom status is memorized to keep the status that the user chose persistent
      const customStatus = localStorage.getItem("customStatus")
      if(customStatus){
        // if custom status is set to offline don't inform other friends and mutual server members that the user is online
        if(customStatus === "OFFLINE"){
          setStatus("OFFLINE")
          await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/setStatus`, {
            id: user.id,
            status: "OFFLINE"
          }, {
            withCredentials: true
          })
        }
        else if(customStatus !== "OFFLINE"){
          setStatus(customStatus)
          await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/setStatus`, {
            id: user.id,
            status: customStatus
          }, {
            withCredentials: true
          })
          const cachedServers = Cookies.get("cachedServers")
          if(cachedServers){
            const serverRooms = returnServerIds(JSON.parse(cachedServers))
            // emitting a status change event to all servers that the user is in
            socket.emit("server_member_status_changed", {
              userId: user.id,
              serverRooms
            })
          }
        }
      }
      else {
        // else if user has no custom status, set his status to online
        setStatus("ONLINE")
        await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/setStatus`, {
          id: user.id,
          status: "ONLINE"
        }, {
          withCredentials: true
        })
        const cachedServers = Cookies.get("cachedServers")
        if(cachedServers){
          const serverRooms = returnServerIds(JSON.parse(cachedServers))
          // emitting a status change event to all servers that the user is in
          socket.emit("server_member_status_changed", {
            userId: user.id,
            serverRooms
          })
        }
      }
    }
  }

  // function to be invoked when the current user closes the app
  const handleDisconnect = () => {
    if(Cookies.get("cachedFriends")){
      socket.emit("update_friend_status", {
        friends: JSON.parse(Cookies.get("cachedFriends")),
        userId: user.id
      })
    }
    fetch(`${import.meta.env.VITE_SERVER_URL}/users/setStatus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "OFFLINE"
      }),
      keepalive: true,
      credentials: "include"
    })
    const cachedServers = Cookies.get("cachedServers")
    if(cachedServers){
      const serverRooms = returnServerIds(JSON.parse(cachedServers))
      socket.emit("server_member_status_changed", {
        userId: user.id,
        serverRooms
      })
    }
  }

  // function that fetches all the servers the current user has joined
  const fetchServers = async () => {
    try{
      const servers = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchByUser/${user.id}`, {
        withCredentials: true
      })
      setServers(servers.data)
      Cookies.set("cachedServers", JSON.stringify(servers.data))
      setServersLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  // function that fetches all types of notifications that the user has
  const fetchNotifications = async () => {
    if(!user.id) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/notifications/fetchAllNotifications/${user.id}`, {
        withCredentials: true
      })
      setDirectMessageNotifications(response.data.DirectMessageNotifications)
      setFriendRequestNotifications(response.data.FriendRequestNotifications)
    }
    catch(error){
      console.log(error)
    }
  }

  // function to retrieve friend request notifications the user has received
  const fetchFriendRequestNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/notifications/fetchFriendRequestNotifications/${user.id}`, {
        withCredentials: true
      })
      setFriendRequestNotifications(response.data.requests)
    }
    catch(error){
      console.log(error)
    }
  }

  // function to retrieve direct message notifications the user has received
  const fetchDirectMessageNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/notifications/fetchDirectMessageNotifications/${user.id}`, {
        withCredentials: true
      })
      setDirectMessageNotifications(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const fetchConversations = async () => {
    try {
      const conversations = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/fetch`,{
        id: user.id
      }, {
        withCredentials: true
      })
      setConversations(conversations.data)
      setConstantConversations(conversations.data)
      setConversationsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const cacheFriends = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchAllFriends`,{
        id: user.id
      }, {
        withCredentials: true
      })
      Cookies.set("cachedFriends", JSON.stringify(returnFriendsIds(response.data)))
      // send a socket event to all friends to update the status of the current user instantly for them as well
      if(Cookies.get("cachedFriends")){
        socket.emit("update_friend_status", {
          friends: JSON.parse(Cookies.get("cachedFriends")),
          userId: user.id
        })
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const handleNotificationSettings = () => {
    const notifications = localStorage.getItem("notificationsEnabled")
    if(!notifications){
      localStorage.setItem("notificationsEnabled", JSON.stringify({
        desktop: true,
        directMessages: true,
        friendRequests: true
      }))
    }
    else {
      setNotificationsEnabled(JSON.parse(notifications))
    }
  }

  return (
    <Context.Provider value={{
      user,
      setUser,
      socket,
      conversations,
      setConversations,
      constantConversations,
      setConstantConversations,
      conversationChosen,
      setConversationChosen,
      micEnabled,
      setMicEnabled,
      deafened,
      setDeafened,
      cameraEnabled,
      setCameraEnabled,
      isSpeaking,
      setIsSpeaking,
      screenShareEnabled,
      setScreenShareEnabled,
      selectScreenShare,
      setSelectScreenShare,
      connectionQuality,
      setConnectionQuality,
      displayRoom,
      setDisplayRoom,
      status,
      setStatus,
      currentVoiceChannelId,
      setCurrentVoiceChannelId,
      servers,
      setServers,
      token,
      setToken,
      connectionState,
      setConnectionState,
      serversLoading,
      setServersLoading,
      fetchServers,
      handleConnect,
      handleDisconnect,
      directMessageNotifications,
      setDirectMessageNotifications,
      friendRequestNotifications,
      setFriendRequestNotifications,
      fetchFriendRequestNotifications,
      fetchDirectMessageNotifications,
      currentConversationId,
      setCurrentConversationId,
      currentServerId,
      setCurrentServerId,
      display,
      setDisplay,
      selected,
      setSelected,
      conversationsLoading,
      setConversationsLoading,
      fetchConversations,
      notificationsEnabled,
      setNotificationsEnabled
    }}>
      {children}
    </Context.Provider>
  )
}