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
import ServerSettings from '../components/Server/Settings/ServerSettings';
import Settings from '../components/Settings/Settings';

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
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/server/settings' element={<ServerSettings/>}/>
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