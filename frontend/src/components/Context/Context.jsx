import React from "react";
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [user,setUser] = useState({ loggedIn: null })

  useEffect(() => {
    authenticateSession()
  },[])

  const authenticateSession = async () => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/login`, { withCredentials: true })
    setUser(response.data)
  }

  return (
    <Context.Provider value={{ user, setUser }}>
      {children}
    </Context.Provider>
  )
}