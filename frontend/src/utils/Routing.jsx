import React, { Suspense, lazy } from 'react';
import { useContext } from 'react';
import { Navigate, Route, Routes } from "react-router-dom"

import { Context } from "../components/Context/Context"

// loading component
import NullRouting from './NullRouting/NullRouting';

// route components
import ServerSettings from "../components/Server/Settings/ServerSettings"
import Settings from "../components/Settings/Settings"
const Login = lazy(() => import('../components/auth/Login/Login'))
const Signup = lazy(() => import("../components/auth/Signup/Signup"))
const ForgotPassword = lazy(() => import("../components/auth/ForgotPassword/ForgotPassword"))
const Home = lazy(() => import('../components/Home/Home'))
const NotFound = lazy(() => import('./NotFound/NotFound'))
const InternetIssue = lazy(() => import('./InternetIssue/InternetIssue'))

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
      <Route path='/offline' element={<Suspense><InternetIssue/></Suspense>}/>
      {user.loggedIn === null ? <Route path='/' element={<NullRouting/>}/> : 
        user.loggedIn ? (
          // routes for authenticated users
          <>
            <Route path='/' element={<Suspense fallback={<NullRouting />}><Home/></Suspense>}/>
            <Route path='/login' element={<Navigate to="/"/>}/>
            <Route path='/signup' element={<Navigate to="/"/>}/>
            <Route path='/settings' element={<Settings/>}/>
            <Route path='/server/settings' element={<Suspense><ServerSettings/></Suspense>}/>
            <Route path='*' element={<Suspense><NotFound/></Suspense>}/>
          </>
        )
        :
        (
          // routes for unauthenticated users
          <>
            <Route path='/login' element={<Suspense><Login/></Suspense>}/>
            <Route path='/signup' element={<Suspense><Signup/></Suspense>}/>
            <Route path='/forgotpassword' element={<Suspense><ForgotPassword/></Suspense>}/>
            <Route path='*' element={<Navigate to="/login"/>}/>
          </>
        )
      }
    </Routes>
  )
};

export default Routing;