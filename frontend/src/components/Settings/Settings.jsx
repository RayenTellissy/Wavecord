import React, { useContext, useState } from 'react';
import axios from 'axios';
import { useDisclosure } from "@chakra-ui/react"

// components
import { Context } from '../Context/Context';
import DisplayButton from '../common/DisplayButton/DisplayButton';
import MyAccount from './Screens/MyAccount/MyAccount';
import PatchNotes from "../../utils/PatchNotes/PatchNotes"

// styles
import "./Settings.css"

const Settings = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setUser, handleDisconnect } = useContext(Context)
  const [display,setDisplay] = useState("account")
  
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

  return (
    <div id='user-settings-container'>
      <PatchNotes isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>
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
            display="Log out"
            callback={logout}
          />
        </div>
      </div>
      <div id='user-settings-info-container'>
        <div id='user-settings-info'>
          {display === "account" ? <MyAccount/> : ""}
        </div>
      </div>
    </div>
  );
};

export default Settings;