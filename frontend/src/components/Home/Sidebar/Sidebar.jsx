import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import HomeButton from "./HomeButton/HomeButton"
import Servers from "./Servers/Servers"
import CreateServer from "./Servers/CreateServer"
import { Context } from '../../Context/Context';

// styles
import "./Sidebar.css"

const Sidebar = ({ highlighted }) => {
  const { user } = useContext(Context)
  const [servers,setServers] = useState([])

  useEffect(() => {
    fetchServers()
  },[])

  // function to fetch servers for the current user
  const fetchServers = async () => {
    try{
      const servers = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchByUser/${user.id}`)
      setServers(servers.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-server-bar'>
      <HomeButton/>
      <span id='home-line-seperator'/>
      <Servers servers={servers} highlighted={highlighted} />
      <CreateServer/>
    </div>
  );
};

export default Sidebar;