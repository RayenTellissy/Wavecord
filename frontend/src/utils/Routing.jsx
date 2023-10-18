import React from 'react';
import { useContext } from 'react';
import { Navigate, Route, Routes } from "react-router-dom"

import { Context } from "../components/Context/Context"

// loading component
import NullRouting from './NullRouting/NullRouting';

// route components
import ServerSettings from "../components/Server/Settings/ServerSettings"
import Settings from "../components/Settings/Settings"
import Login from "../components/auth/Login/Login"
import Signup from "../components/auth/Signup/Signup"
import ForgotPassword from "../components/auth/ForgotPassword/ForgotPassword"
import Home from '../components/Home/Home'
import NotFound from './NotFound/NotFound'
import InternetIssue from './InternetIssue/InternetIssue'
import TurboRedirect from '../components/Turbo/TurboRedirect';

const Routing = () => {
  const { user, serversLoading, conversationsLoading } = useContext(Context)

  // show a loading screen until the app loads the important data
  if(user.loggedIn && (serversLoading || conversationsLoading)){
    return <Routes>
      <Route path='/' element={<NullRouting />} />
    </Routes>
  }

  return (
    <Routes>
      <Route path='/offline' element={<InternetIssue/>}/>
      {user.loggedIn === null ? <Route path='/' element={<NullRouting/>}/> : 
        user.loggedIn ? (
          // routes for authenticated users
          <>
            <Route path='/' element={<Home/>}/>
            <Route path='/login' element={<Navigate to="/"/>}/>
            <Route path='/signup' element={<Navigate to="/"/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/server/settings' element={<ServerSettings/>}/>
            <Route path='/turbo' element={<TurboRedirect />} />
            <Route path='*' element={<NotFound/>}/>
          </>
        )
        :
        (
          // routes for unauthenticated users
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