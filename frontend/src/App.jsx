import React from "react"
import "./App.css"

// common components
import BugReport from "./utils/BugReport/BugReport"

// Application Router
import Routing from "./utils/Routing"

const App = () => {
  return (
    <>
      <BugReport/>
      <Routing/>
    </>
  )
}

export default App