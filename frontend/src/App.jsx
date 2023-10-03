import React, { useContext, useEffect, useState } from "react"
import { useDisclosure } from "@chakra-ui/react"

// common components
import BugReport from "./utils/BugReport/BugReport"
import { Context } from "./components/Context/Context"
import BanModal from "./utils/BanModal/BanModal"
import NotificationSound from "./utils/NotificationSound"

// Application Router
import Routing from "./utils/Routing"

// default styling
import "./App.css"

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    socket,
    setDisplay,
    setCurrentServerId,
    fetchServers
  } = useContext(Context)
  const [bannedFrom,setBannedFrom] = useState(null)

  // useEffect for app notifications
  useEffect(() => {
    if(socket){
      socket.on("receive_server_ban", data => {
        fetchServers()
        setBannedFrom({
          name: data.serverName,
          reason: data.reason,
          type: "ban"
        })
        onOpen() // opening the banned modal
      })
      socket.on("receive_server_kick", data => {
        fetchServers()
        setBannedFrom({
          name: data.serverName,
          reason: data.reason,
          type: "kick"
        })
        onOpen()
      })
      return () => {
        socket.off("receive_server_ban")
        socket.off("receive_server_kick")
      }
    }
  },[socket])

  const closeBanModal = () => {
    setDisplay("")
    setCurrentServerId("")
    onClose()
    setBannedFrom(null)
  }

  return (
    <>
      <BanModal bannedFrom={bannedFrom} isOpen={isOpen} onClose={closeBanModal}/>
      <BugReport/>
      <Routing/>
      <NotificationSound/>
    </>
  )
}

export default App