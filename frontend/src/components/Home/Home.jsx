import React, { useContext, useEffect, useState } from 'react';
import { faBolt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Box } from '@chakra-ui/react';
import axios from "axios"

// components
import { Context } from "../Context/Context"
import HomeButton from './Sidebar/HomeButton/HomeButton';
import Server from './Sidebar/Servers/Server';

// styles
import "./Home.css"

const Home = () => {

  const { user } = useContext(Context)
  const [servers,setServers] = useState([])

  useEffect(() => {
    fetchServers()
  },[])

  const fetchServers = async () => {
    try{
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchByUser/${user.id}`)
      setServers(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div>
      
      <div id='home-server-bar'>
        <HomeButton/>
        <span id='home-line-seperator'/>

        {servers.map((e,i) => {
          return <Server key={i} id={e.serverId.id} name={e.serverId.name} image={e.serverId.image} />
        })}
      {/* <Button leftIcon={<FontAwesomeIcon icon={faBolt} />}>
        Turbo
      </Button> */}
      </div>
    </div>
  );
};

export default Home;