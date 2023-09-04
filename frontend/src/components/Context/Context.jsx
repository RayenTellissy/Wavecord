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

  useEffect(() => {
    authenticateSession()
    handleSocket()
  },[])

  useEffect(() => {
    console.log(user)
  },[user])

  
  const authenticateSession = async () => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/login`, {
      withCredentials: true,
      headers: {
        "Authorization": `Bearer ${user.token}`
      }
    })
    setUser(response.data)
  }

  const handleSocket = () => {
    const socket = io.connect(import.meta.env.VITE_SOCKET_URL)
    setSocket(socket)
  }

  return (
    <Context.Provider value={{ user, setUser, socket, authenticateSession }}>
      {children}
    </Context.Provider>
  )
}