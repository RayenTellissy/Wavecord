import React from "react"
import { useLocation } from "react-router-dom"
import addNotification, { Notifications } from "react-push-notification"

// common components
import BugReport from "./utils/BugReport/BugReport"

// Application Router
import Routing from "./utils/Routing"

// helper functions
import returnLocation from "./utils/Helper/returnLocation"

// default styling
import "./App.css"

const App = () => {
  // const location = useLocation().pathname

  // useEffect(() => {

  // },[location])

  const notify = () => {
    addNotification({
      title: "username",
      message: "the message sent",
      icon: "user image",
      duration: 3000,
      native: true,
      onClick: () => console.log("navigate to conversation")
    })
  }

  return (
    <>
      <BugReport/>
      <Routing/>
    </>
  )
}

export default App