import React, { useContext, useEffect } from 'react';
import axios from "axios"

// components
import HomeButton from "./HomeButton/HomeButton"
import Servers from "./Servers/Servers"
import CreateServer from "./Servers/CreateServer"
import { Context } from '../../Context/Context';
import Notification from './Notification/Notification';

// styles
import "./Sidebar.css"

const Sidebar = ({ highlighted, setSelected }) => {
  const { user, socket, servers, directMessageNotifications, setDirectMessageNotifications } = useContext(Context)

  useEffect(() => {
    socket.on("receive_direct_message_notification", () => {
      fetchDirectMessageNotifications()
    })
  },[socket])

  const fetchDirectMessageNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/notifications/fetchDirectMessageNotifications/${user.id}`, {
        withCredentials: true
      })
      setDirectMessageNotifications(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-server-bar'>
      {directMessageNotifications && Object.keys(directMessageNotifications).length
      ? Object.keys(directMessageNotifications).map((key,i) => {
        const e = directMessageNotifications[key]
        return <Notification
          key={i}
          conversationId={e.conversationId}
          id={e.sender.id}
          username={e.sender.username}
          image={e.sender.image}
          status={e.sender.status}
          messages={e.messages}
        />
      }) : <HomeButton setSelected={setSelected}/>}
      <span id='home-line-seperator'/>
      <Servers servers={servers} highlighted={highlighted} />
      <CreateServer/>
    </div>
  );
};

export default Sidebar;