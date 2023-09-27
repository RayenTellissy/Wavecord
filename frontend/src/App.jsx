import React from "react"

// common components
import BugReport from "./utils/BugReport/BugReport"

// Application Router
import Routing from "./utils/Routing"

// default styling
import "./App.css"

const App = () => {

  return (
    <>
      <BugReport/>
      <Routing/>
    </>
  )
}

export default App