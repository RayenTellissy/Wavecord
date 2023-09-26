import React, { useContext, useEffect } from 'react';

// components
import HomeButton from "./HomeButton/HomeButton"
import Servers from "./Servers/Servers"
import CreateServer from "./Servers/CreateServer"
import { Context } from '../../Context/Context';
import Notification from './Notification/Notification';

// styles
import "./Sidebar.css"

const Sidebar = ({ highlighted }) => {
  const { servers, fetchServers, notifications } = useContext(Context)

  useEffect(() => {
    fetchServers()
  },[])

  return (
    <div id='home-server-bar'>
      {notifications && Object.keys(notifications.DirectMessageNotifications).length
      ? Object.keys(notifications.DirectMessageNotifications).map((key,i) => {
        const e = notifications.DirectMessageNotifications[key]
        return <Notification
          key={i}
          conversationId={e.conversationId}
          username={e.sender.username}
          image={e.sender.image}
          messages={e.messages}
        />
      }) : <HomeButton/>}
      <span id='home-line-seperator'/>
      <Servers servers={servers} highlighted={highlighted} />
      <CreateServer/>
    </div>
  );
};

export default Sidebar;