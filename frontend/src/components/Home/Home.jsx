import React, { useContext, useEffect, useState } from 'react';
import { faBolt, faUserGroup } from "@fortawesome/free-solid-svg-icons"
import axios from "axios"
import PropogateLoader from "react-spinners/PropagateLoader"

// components
import { Context } from "../Context/Context"
import HomeButton from './Sidebar/HomeButton/HomeButton';
import HomeNavigator from './ContactsBar/HomeNavigator/HomeNavigator';
import DirectMessagesText from './ContactsBar/DirectMessages/DirectMessagesText';
import Search from './ContactsBar/SearchBar/Search';
import Servers from './Sidebar/Servers/Servers';
import UserBar from './ContactsBar/UserBar/UserBar';
import CreateServer from './Sidebar/Servers/CreateServer';

// styles
import "./Home.css"
import Conversations from './ContactsBar/Conversations/Conversations';

const Home = () => {

  const { user } = useContext(Context)
  const [servers,setServers] = useState([])
  const [conversations,setConversations] = useState([])
  const [isLoading,setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetchServers()
    fetchConversations()
    setIsLoading(false)
  },[])

  // function to fetch servers for the current user
  const fetchServers = async () => {
    try{
      const servers = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchByUser/${user.id}`,{
        withCredentials: true
      })
      setServers(servers.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const fetchConversations = async () => {
    try {
      const conversations = await axios.get(`${import.meta.env.VITE_SERVER_URL}/conversations/fetch/${user.id}`,{
        withCredentials: true
      })
      setConversations(conversations.data)
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
          <CreateServer/>
        </div>

        <div id='home-contacts-bar'>
          
          <Search/>

          <div id='home-contacts-navigators'>
            <HomeNavigator text="Friends" icon={faUserGroup}/>
            <HomeNavigator text="Turbo" icon={faBolt}/>
          </div>

          <DirectMessagesText/>
          <Conversations conversations={conversations}/>

          <UserBar/>

        </div>

        <div>
          <button onClick={async () => {
            await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`, { withCredentials: true })
          }}>
            log out
          </button>
        </div>

        {/* {isLoading && <div id='home-loader'>
          <PropogateLoader loading={isLoading} color='#0d6bf7'/>
         </div>} */}

      </div>

    </div>
  );
};

export default Home;