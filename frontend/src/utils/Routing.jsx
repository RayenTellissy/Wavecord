import React from 'react';
import { useContext } from 'react';
import { Navigate, Route, Routes } from "react-router-dom"

import { Context } from "../components/Context/Context"

// common components
import Spinner from "../components/common/Spinner/Spinner"

// route components
import Login from '../components/auth/Login/Login'
import Signup from "../components/auth/Signup/Signup"
import ForgotPassword from "../components/auth/ForgotPassword/ForgotPassword"

const Routing = () => {
  const { user } = useContext(Context)

  return (
    <Routes>
      {user.loggedIn === null ? "" : 
        user.loggedIn ? (
          <>
            <Route path='/login' element={<Navigate to="/"/>}/>
            <Route path='/signup' element={<Navigate to="/"/>}/>
            <Route path='/' element={<p>this is home</p>}/>
            <Route path='/settings' element={<p>this is settings</p>}/>
          </>
        )
        :
        (
          <>
            <Route path='*' element={<Navigate to="/login"/>}/>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/forgotpassword' element={<ForgotPassword/>}/>
          </>
        )
      }
      
    </Routes>
  )
};

export default Routing;