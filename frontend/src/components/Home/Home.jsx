import React, { useContext, useEffect, useState } from 'react';
import { faBolt, faUserGroup } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"

// components
import { Context } from "../Context/Context"
import HomeButton from './Sidebar/HomeButton/HomeButton';
import HomeNavigator from './ContactsBar/HomeNavigator/HomeNavigator';
import DirectMessagesText from './ContactsBar/DirectMessages/DirectMessagesText';
import Search from './ContactsBar/SearchBar/Search';
import Servers from './Sidebar/Servers/Servers';
import UserBar from './ContactsBar/UserBar/UserBar';

// styles
import "./Home.css"

const Home = () => {

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
    <div>
      
      <div id='home-container'>
        
        <div id='home-server-bar'>
          <HomeButton/>
          <span id='home-line-seperator'/>

          <Servers servers={servers} />
        </div>

        <div id='home-contacts-bar'>
          
          <Search/>

          <div id='home-contacts-navigators'>
            <HomeNavigator text="Friends" icon={faUserGroup}/>
            <HomeNavigator text="Turbo" icon={faBolt}/>
          </div>

          <DirectMessagesText/>

          <UserBar/>

        </div>

      </div>
    </div>
  );
};

export default Home;