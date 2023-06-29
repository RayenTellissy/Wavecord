import React from 'react';
import { faBolt } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Box } from '@chakra-ui/react';
import axios from "axios"

// components
import HomeButton from './Sidebar/HomeButton/HomeButton';
import Server from './Sidebar/Servers/Server';

// styles
import "./Home.css"

const Home = () => {

  const fetchServers = async () => {
    const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch`)
  }

  return (
    <div>
      
      <div id='home-server-bar'>
        <HomeButton/>
        <span id='home-line-seperator'/>

        
      {/* <Button leftIcon={<FontAwesomeIcon icon={faBolt} />}>
        Turbo
      </Button> */}
      </div>
    </div>
  );
};

export default Home;