import React from "react";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"

export const Context = createContext()

// hooks
import useMic from "../../hooks/useMic";
import useConversation from "../../hooks/useConversation"

export const ContextProvider = ({ children }) => {
  const [user,setUser] = useState({
    loggedIn: null,
    token: localStorage.getItem("wavecord-token"),
    id: localStorage.getItem("wavecord-id")
  })
  const [socket,setSocket] = useState(null)
  const [conversations,setConversations] = useState([])
  const [conversationChosen,setConversationChosen] = useConversation()
  const [micEnabled,setMicEnabled] = useMic()
  const [cameraEnabled,setCameraEnabled] = useState(false)
  const [isSpeaking,setIsSpeaking] = useState(false)
  const [screenShareEnabled,setScreenShareEnabled] = useState(false)
  const [connectionQuality,setConnectionQuality] = useState(null)
  const [displayRoom,setDisplayRoom] = useState(false)
  const [status,setStatus] = useState("")

  useEffect(() => {
    authenticateSession()
    handleSocket()
    return () => window.removeEventListener("beforeunload", handleDisconnect)
  },[])

  useEffect(() => {
    handleConnect()
    if(socket){
      window.addEventListener("beforeunload", handleDisconnect)
    }
  },[socket])

  const authenticateSession = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
        headers: {
          "authorization": user.token,
          "x-refresh-token": localStorage.getItem("wavecord-refreshToken")
        }
      })
      localStorage.setItem("wavecord-token", response.data.token)
      setUser(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleSocket = () => {
    const socket = io.connect(import.meta.env.VITE_SOCKET_URL)
    setSocket(socket)
  }

  const handleConnect = () => {
    if(socket){
      socket.emit("statusChanged", {
        id: user.id,
        status: "ONLINE"
      })
      setStatus("ONLINE")
    }
  }

  const handleDisconnect = () => {
    socket.emit("statusChanged", {
      id: user.id,
      status: "OFFLINE"
    })
    setStatus("OFFLINE")
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
      connectionQuality,
      setConnectionQuality,
      displayRoom,
      setDisplayRoom,
      status,
      setStatus
    }}>
      {children}
    </Context.Provider>
  )
}