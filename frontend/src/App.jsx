import { Routes, Route } from "react-router-dom"
import "./App.css"

// common components
import ToggleColorMode from './theme/ToggleColorMode'

// Application Router
import Routing from "./utils/Routing"

const App = () => {
  return (
    <>
      <ToggleColorMode />
      <Routing/>
    </>
  )
}

export default App