import { createContext, useEffect, useState } from "react";

export const Context = createContext()

export const ContextProvider = ({ children }) => {
  const [user,setUser] = useState({ loggedIn: false })

  useEffect(() => {
    console.log(user)
  },[user])

  return (
    <Context.Provider value={{ user, setUser }}>
      {children}
    </Context.Provider>
  )
}