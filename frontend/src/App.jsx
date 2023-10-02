import React, { useContext, useEffect, useState } from "react"
import { useDisclosure } from "@chakra-ui/react"

// common components
import BugReport from "./utils/BugReport/BugReport"
import { Context } from "./components/Context/Context"

// Application Router
import Routing from "./utils/Routing"

// helper functions
import { createFriendRequestNotification, createDirectMessageNotification } from "./utils/Helper/createNotification"

// default styling
import "./App.css"
import BanModal from "./utils/BanModal/BanModal"

const App = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    socket,
    fetchFriendRequestNotifications,
    setConversationChosen,
    setCurrentConversationId,
    setDisplay,
    setCurrentServerId,
    fetchServers
  } = useContext(Context)
  const [bannedFrom,setBannedFrom] = useState(null)

  // useEffect for app notifications
  useEffect(() => {
    if(socket){
      socket.on("receive_friend_request_notification", data => {
        fetchFriendRequestNotifications()
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
        createDirectMessageNotification({
          username: data.username,
          image: data.image,
          message: data.message,
          callback: navigateToConversation
        })
      })
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
        socket.off("receive_friend_request_notification")
        socket.off("receive_direct_message_notification")
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
    </>
  )
}

export default App