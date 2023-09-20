import React, { useContext, useEffect } from 'react';

// components
import HomeButton from "./HomeButton/HomeButton"
import Servers from "./Servers/Servers"
import CreateServer from "./Servers/CreateServer"
import { Context } from '../../Context/Context';

// styles
import "./Sidebar.css"

const Sidebar = ({ highlighted }) => {
  const { servers, fetchServers } = useContext(Context)

  useEffect(() => {
    fetchServers()
  },[])

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