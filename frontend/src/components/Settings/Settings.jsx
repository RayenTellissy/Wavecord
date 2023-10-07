import React, { useContext, useState } from 'react';
import axios from 'axios';

//components
import { Context } from '../Context/Context';

// styles
import "./Settings.css"

const Settings = () => {
  const { setUser } = useContext(Context)
  const [display,setDisplay] = useState("account")
  
  const logout = async () => {
    try {
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
      <div id='user-settings-dropdown-container'>
        <div id='user-settings-dropdown'>
          <p id='user-settings-title'>USER SETTINGS</p>
        </div>
      </div>
      <div id='user-settings-info-container'>
        <div id='user-settings-info'>
          
        </div>
      </div>
      <button onClick={logout}>log out</button>
    </div>
  );
};

export default Settings;