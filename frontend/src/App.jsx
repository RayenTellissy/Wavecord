import React, { useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"

// common components
import BugReport from "./utils/BugReport/BugReport"
import { Context } from "./components/Context/Context"

// Application Router
import Routing from "./utils/Routing"

// helper functions
import { createFriendRequestNotification, createDirectMessageNotification } from "./utils/Helper/createNotification"

// default styling
import "./App.css"

const App = () => {
  const { socket, fetchFriendRequestNotifications, setConversationChosen } = useContext(Context)
  const navigate = useNavigate()

  // useEffect for app notifications
  useEffect(() => {
    if(socket){
      socket.on("receive_friend_request_notification", data => {
        fetchFriendRequestNotifications()
        createFriendRequestNotification({
          username: data.username,
          image: data.image,
          callback: notificationCallback
        })
      })
      socket.on("receive_direct_message_notification", data => {
        const navigateToConversation = () => {
          setConversationChosen({ id: data.id, username: data.username, image: data.image, status: data.status })
          navigate(`/dm/${data.conversationId}`)
        }
        createDirectMessageNotification({
          username: data.username,
          image: data.image,
          message: data.message,
          callback: navigateToConversation
        })
      })
      return () => {
        socket.off("receive_friend_request_notification")
        socket.off("receive_direct_message_notification")
      }
    }
  },[socket])


  return (
    <>
      <BugReport/>
      <Routing/>
    </>
  )
}

export default App