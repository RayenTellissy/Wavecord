import React, { useContext } from 'react';
import axios from 'axios';

//components
import { Context } from '../Context/Context';

// styles
import "./Settings.css"

const Settings = () => {
  const { setUser } = useContext(Context)
  
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
    <div>
      <button onClick={logout}>log out</button>
    </div>
  );
};

export default Settings;