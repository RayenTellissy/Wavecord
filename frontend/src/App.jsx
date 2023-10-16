import React, { useContext, useEffect, useState } from "react"
import { useDisclosure } from "@chakra-ui/react"

// common components
import BugReport from "./utils/BugReport/BugReport"
import { Context } from "./components/Context/Context"
import BanModal from "./utils/BanModal/BanModal"
import NotificationSound from "./utils/NotificationSound"
import PatchNotes from "./utils/PatchNotes/PatchNotes"

// Application Router
import Routing from "./utils/Routing"

// default styling
import "./App.css"

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: patchIsOpen, onOpen: patchOnOpen, onClose: patchOnClose } = useDisclosure()
  const {
    socket,
    setDisplay,
    setCurrentServerId,
    fetchServers,
    serversLoading,
    conversationsLoading
  } = useContext(Context)
  const [bannedFrom,setBannedFrom] = useState(null)
  const [appLoaded,setAppLoaded] = useState(false)

  useEffect(() => {
    if(!serversLoading && !conversationsLoading){
      setAppLoaded(true)
    }
  },[serversLoading,conversationsLoading])

  // useEffect for app notifications
  useEffect(() => {
    if(socket){
      socket.on("receive_server_ban", data => {
        fetchServers()
        setDisplay("")
        setCurrentServerId("")
        setBannedFrom({
          name: data.serverName,
          reason: data.reason,
          type: "ban"
        })
        onOpen() // opening the banned modal
      })
      socket.on("receive_server_kick", data => {
        fetchServers()
        setDisplay("")
        setCurrentServerId("")
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
    onClose()
    setBannedFrom(null)
  }

  return (
    <>
      {appLoaded && <>
        <BanModal bannedFrom={bannedFrom} isOpen={isOpen} onClose={closeBanModal}/>
        <PatchNotes isOpen={patchIsOpen} onOpen={patchOnOpen} onClose={patchOnClose}/>
        <BugReport/>
        <NotificationSound/>
      </>}
      <Routing/>
    </>
  )
}

export default App