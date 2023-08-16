import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// components
import Sidebar from '../Home/Sidebar/Sidebar';
import TextChannel from './TextChannel/TextChannel';

// styles
import "./Server.css"

const Server = () => {
  const { id } = useParams()
  const [server,setServer] = useState({})
  const [currentTextChannel,setCurrentTextChannel] = useState("")
  
  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${id}`)
      setServer(response.data)
      console.log(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-container'>
      <Sidebar highlighted={server.id}/>
      <div id='server-bar-container'>
        <div id='server-bar-main'>
          <div id='server-name-container'>
            <p id='server-name'>{server.name}</p>
          </div>
          {server.Text_channels && server.Text_channels.map((e,i) => {
            return <TextChannel key={i} id={e.id} name={e.name}/>
          })}
        </div>
      </div>
    </div>
  );
};

export default Server;