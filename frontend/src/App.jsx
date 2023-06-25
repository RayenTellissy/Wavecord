import { Routes, Route } from "react-router-dom"
import "./App.css"

// common components
import ToggleColorMode from './theme/ToggleColorMode'

// route components
import Login from './components/auth/Login/Login'
import Signup from "./components/auth/Signup/Signup"

const App = () => {
  return (
    <>
      <ToggleColorMode/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </>
  )
}

export default App