import React from 'react';
import { useContext } from 'react';
import { Navigate, Route, Routes } from "react-router-dom"

import { Context } from "../components/Context/Context"

// null routing
import NullRouting from './NullRouting/NullRouting';

// route components
import Login from '../components/auth/Login/Login'
import Signup from "../components/auth/Signup/Signup"
import ForgotPassword from "../components/auth/ForgotPassword/ForgotPassword"
import Home from '../components/Home/Home'
import Server from '../components/Server/Server';
import Messages from '../components/Messages/Messages';

const Routing = () => {
  const { user } = useContext(Context)

  return (
    <Routes>
      {user.loggedIn === null ? <Route path='/' element={<NullRouting/>}/> : 
        user.loggedIn ? (
          <>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Navigate to="/"/>}/>
            <Route path='/signup' element={<Navigate to="/"/>}/>
            <Route path='/settings' element={<p>this is settings</p>}/>
            <Route path='/server/:id' element={<Server/>}/>
            <Route path='/dm/:id' element={<Messages/>}/>
          </>
        )
        :
        (
          <>
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path='/forgotpassword' element={<ForgotPassword/>}/>
            <Route path='*' element={<Navigate to="/login"/>}/>
          </>
        )
      }
      
    </Routes>
  )
};

export default Routing;