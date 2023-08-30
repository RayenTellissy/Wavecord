import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// components
import DisplayButton from './DisplayButton/DisplayButton';
import Overview from './Screens/Overview';
import Roles from './Screens/Roles';

// styles
import "./ServerSettings.css"

const ServerSettings = () => {
  const { id } = useParams()
  const [server,setServer] = useState({})
  const [display,setDisplay] = useState("Overview")

  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${id}`)
      setServer(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-settings-container'>
      <div id='server-settings-dropdown-container'>
        <div id='server-settings-dropdown'>
          {server.name && <p id='server-settings-server-name-title'>{ server.name.toUpperCase() }</p>}
          <DisplayButton
            display="Overview"
            callback={() => setDisplay("Overview")}
          />
          <DisplayButton
            display="Roles"
            callback={() => setDisplay("Roles")}
          />
          <DisplayButton 
            display="Members"
            callback={() => setDisplay("Members")}
          />
          <DisplayButton
            display="Bans"
            callback={() => setDisplay("Bans")}
          />
        </div>
      </div>
      <div id='server-settings-info-container'>
        <div id='server-settings-info'>
          {display === "Overview" ? <Overview/> : <Roles/>}
        </div>
      </div>
    </div>
  );
};

export default ServerSettings;