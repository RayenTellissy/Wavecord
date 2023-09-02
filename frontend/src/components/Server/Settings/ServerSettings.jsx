import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

// components
import DisplayButton from './DisplayButton/DisplayButton';
import Overview from './Screens/Overview/Overview';
import Roles from './Screens/Roles/Roles';
import Members from './Screens/Members/Members';

// styles
import "./ServerSettings.css"

const ServerSettings = () => {
  const location = useLocation()
  const [display,setDisplay] = useState("Overview")
  const [server,setServer] = useState(location.state)

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${server.id}`)
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
            highlighted={display === "Overview"}
          />
          <DisplayButton
            display="Roles"
            callback={() => setDisplay("Roles")}
            highlighted={display === "Roles"}
          />
          <DisplayButton
            display="Members"
            callback={() => setDisplay("Members")}
            highlighted={display === "Members"}
          />
          <DisplayButton
            display="Bans"
            callback={() => setDisplay("Bans")}
            highlighted={display === "Bans"}
          />
        </div>
      </div>
      <div id='server-settings-info-container'>
        <div id='server-settings-info'>
          {display === "Overview"
          ? <Overview server={server} fetchData={fetchData}/> 
          : (display === "Roles"
          ? <Roles server={server}/>
          : <Members server={server}/>)}
        </div>
      </div>
    </div>
  );
};

export default ServerSettings;