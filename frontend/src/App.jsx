import React from "react"
import "./App.css"

// common components
import ToggleColorMode from './theme/ToggleColorMode'
import BugReport from "./utils/BugReport/BugReport"

// Application Router
import Routing from "./utils/Routing"

const App = () => {
  return (
    <>
      <ToggleColorMode />
      <BugReport/>
      <Routing/>
    </>
  )
}

export default App