import { Routes, Route } from "react-router-dom"
import "./App.css"

// common components
import ToggleColorMode from './theme/ToggleColorMode'

// route components
import Login from './components/auth/Login/Login'

const App = () => {
  return (
    <>
      <ToggleColorMode/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
      </Routes>
    </>
  )
}

export default App