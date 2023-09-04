import React from "react";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client"

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [user,setUser] = useState({
    loggedIn: null,
    token: localStorage.getItem("token"),
    id: localStorage.getItem("id")
  })
  const [socket,setSocket] = useState(null)
  const [conversationChosen,setConversationChosen] = useState({})

  useEffect(() => {
    authenticateSession()
    handleSocket()
  },[])

  const authenticateSession = async () => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
      withCredentials: true,
      headers: {
        "authorization": user.token,
        "x-refresh-token": localStorage.getItem("refreshToken")
      }
    })
    localStorage.setItem("token", response.data.token)
    setUser(response.data)
  }

  const handleSocket = () => {
    const socket = io.connect(import.meta.env.VITE_SOCKET_URL)
    setSocket(socket)
  }

  return (
    <Context.Provider value={{ user, setUser, socket, conversationChosen, setConversationChosen }}>
      {children}
    </Context.Provider>
  )
}