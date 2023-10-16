import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Kbd, useDisclosure } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom"
import { IoClose } from 'react-icons/io5';

// components
import { Context } from '../Context/Context';
import DisplayButton from '../common/DisplayButton/DisplayButton';
import MyAccount from './Screens/MyAccount/MyAccount';
import PatchNotes from "../../utils/PatchNotes/PatchNotes"
import Nitro from "./Screens/Nitro/Nitro"
import Notifications from './Screens/Notifications/Notifications';
import LogoutModal from './Screens/LogoutModal/LogoutModal';
import BugReport from "../../utils/BugReport/BugReport"

// styles
import "./Settings.css"

const Settings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: logoutIsOpen, onOpen: logoutOnOpen, onClose: logoutOnClose } = useDisclosure()
  const { isOpen: bugIsOpen, onOpen: bugOnOpen, onClose: bugOnClose } = useDisclosure()
  const { setUser, handleDisconnect } = useContext(Context)
  const [display,setDisplay] = useState("account")
  const navigate = useNavigate()
  const displays = {
    account: <MyAccount />,
    nitro: <Nitro />,
    notifications: <Notifications />
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [])
  
  const logout = async () => {
    try {
      await handleDisconnect()
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`, {
        withCredentials: true
      })
      setUser(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleKeyPress = (e) => {
    if(e.key === "Escape"){
      navigate("/")
    }
  }

  return (
    <div id='user-settings-container'>
      <button id='user-settings-leave-button' onClick={() => navigate("/")}>
        <div id='user-settings-leave-div'>
          <IoClose size={40} color='#a4a8af' />
        </div>
        <Kbd fontFamily="GibsonLight" padding={2}>ESC</Kbd>
      </button>
      <PatchNotes isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
      <BugReport isOpen={bugIsOpen} onClose={bugOnClose} />
      <LogoutModal isOpen={logoutIsOpen} onClose={logoutOnClose} callback={logout} />
      <div id='user-settings-dropdown-container'>
        <div id='user-settings-dropdown'>
          <p id='user-settings-title'>USER SETTINGS</p>
          <DisplayButton
            display="My Account"
            callback={() => setDisplay("account")}
            highlighted={display === "account"}
          />
          <DisplayButton
            display="Nitro"
            callback={() => setDisplay("nitro")}
            highlighted={display === "nitro"}
          />
          <DisplayButton
            display="Notifications"
            callback={() => setDisplay("notifications")}
            highlighted={display === "notifications"}
          />
          <DisplayButton
            display="What's New"
            callback={onOpen}
          />
          <DisplayButton
            display="Bug Report"
            callback={bugOnOpen}
          />
          <DisplayButton
            display="Log out"
            callback={logoutOnOpen}
          />
        </div>
      </div>
      <div id='user-settings-info-container'>
        <div id='user-settings-info'>
          {displays[display]}
        </div>
      </div>
    </div>
  );
};

export default Settings;