import { Routes, Route } from "react-router-dom"
import "./App.css"

// common components
import ToggleColorMode from './theme/ToggleColorMode'

// route components
import Login from './components/auth/Login/Login'
import Signup from "./components/auth/Signup/Signup"
import ForgotPassword from "./components/auth/ForgotPassword/ForgotPassword"
import ProtectedRoutes from "./ProtectedRoutes"

const App = () => {
  return (
    <>
      <ToggleColorMode/>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route element={<ProtectedRoutes/>}>
          <Route path="/forgotpassword" element={<ForgotPassword/>}/>
          <Route path="/home" element={<p>this is home</p>}/>
        </Route>
      </Routes>
    </>
  )
}

export default App