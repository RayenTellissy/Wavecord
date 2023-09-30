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

export const ContextProvider = ({ children }) => {
  const [user,setUser] = useState({
    loggedIn: null,
    id: localStorage.getItem("wavecord-id")
  })
  const [socket,setSocket] = useState(null)
  const [conversations,setConversations] = useState([])
  const [conversationChosen,setConversationChosen] = useConversation()
  const [micEnabled,setMicEnabled] = useMic()
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

  useEffect(() => {
    authenticateSession()
    handleSocket()
    fetchNotifications()
    return () => window.removeEventListener("beforeunload", handleDisconnect)
  },[])

  useEffect(() => {
    if(socket){
      // if status has not been set, invoke connection handler function
      if(!status){
        handleConnect()
      }
      window.addEventListener("beforeunload", handleDisconnect)
    }
  },[socket])

  // function to retrieve all the current user's information
  const authenticateSession = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/login/${user.id}`, {
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
    fetch(`${import.meta.env.VITE_SERVER_URL}/users/setStatus`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: localStorage.getItem("wavecord-id"),
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

  return (
    <Context.Provider value={{
      user,
      setUser,
      socket,
      conversations,
      setConversations,
      conversationChosen,
      setConversationChosen,
      micEnabled,
      setMicEnabled,
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
      directMessageNotifications,
      setDirectMessageNotifications,
      friendRequestNotifications,
      setFriendRequestNotifications,
      fetchFriendRequestNotifications,
      fetchDirectMessageNotifications
    }}>
      {children}
    </Context.Provider>
  )
}