import React from 'react';
import { useContext } from 'react';
import { Navigate, Route, Routes } from "react-router-dom"

import { Context } from "../components/Context/Context"

// route components
import Login from '../components/auth/Login/Login'
import Signup from "../components/auth/Signup/Signup"
import ForgotPassword from "../components/auth/ForgotPassword/ForgotPassword"

const Routing = () => {
  const { user } = useContext(Context)

  return (
    <Routes>
      {!user.isLogged ? (
        <>
          <Route path='/' element={<p>this is home</p>}/>
          <Route path='/login' element={<Navigate to="/"/>}/>
          <Route path='/signup' element={<Navigate to="/"/>}/>
          <Route path='/forgotpassword' element={<ForgotPassword/>}/>
        </>
      )
      :
      (
        <>
          <Route path='/' element={<Navigate to="/login"/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
        </>
      )
      }
    </Routes>
  )
};

export default Routing;