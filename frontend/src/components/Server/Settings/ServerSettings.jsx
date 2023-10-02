import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { IoClose } from 'react-icons/io5';
import { Kbd } from '@chakra-ui/react';

// components
import DisplayButton from './DisplayButton/DisplayButton';
import Overview from './Screens/Overview/Overview';
import Roles from './Screens/Roles/Roles';
import Members from './Screens/Members/Members';
import Bans from './Screens/Bans/Bans';

// styles
import "./ServerSettings.css"

const ServerSettings = () => {
  const location = useLocation()
  const [display,setDisplay] = useState("Overview")
  const [server,setServer] = useState(location.state)
  const navigate = useNavigate()

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    
    return () => document.removeEventListener("keydown", handleKeyPress)
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${server.id}`)
      setServer(response.data)
    }
    catch(error){
      console.log(error)
    }
  }
  const handleKeyPress = (e) => {
    if(e.key === "Escape"){
      navigate(`/server/${server.id}`)
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
          : (display === "Members" ? <Members server={server}/> : <Bans server={server}/> ))}
        <button id='server-settings-leave-button' onClick={() => navigate("/")}>
          <div id='server-settings-leave-div'>
            <IoClose size={40} color='#a4a8af'/>
          </div>
          <Kbd fontFamily="GibsonLight" padding={2}>ESC</Kbd>
        </button>
        </div>
      </div>
    </div>
  );
};

export default ServerSettings;