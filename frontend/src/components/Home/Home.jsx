import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';

// components
import Sidebar from './Sidebar/Sidebar';
import ContactsBar from './ContactsBar/ContactsBar';
import Topbar from './Topbar/Topbar';
import Display from './Screens/Display';
import Turbo from './Turbo/Turbo';
import Messages from '../Messages/Messages';
import { Context } from "../Context/Context"

// styles
import "./Home.css"
import Server from '../Server/Server';

const Home = () => {
  const location = useLocation()
  const selectedLocation = location.state
  const { currentConversationId, currentServerId, display } = useContext(Context)
  const [selected,setSelected] = useState(selectedLocation?.navigator ? selectedLocation.navigator : "Friends")
  const [selectedScreen,setSelectedScreen] = useState(location.state?.selected ? location.state?.selected : "Online")

  return (
    <div>
      
      <div id='home-container'>
        
        <Sidebar highlighted={currentServerId ? currentServerId : null} setSelected={setSelected}/>
        {display !== "server" &&  <ContactsBar
          highlighted={currentConversationId ? currentConversationId : null}
          selected={selected}
          setSelected={setSelected}
        />}

        <div id='home-right-container'>
          {display === "directMessages"
          ? <Messages/>
          : (display === "server" ? <Server/> : <>
            <Topbar selected={selected} selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
            {selected === "Turbo" ? <Turbo/> : <Display selectedScreen={selectedScreen}/>}
          </>)}
        </div>

      </div>

    </div>
  );
};

export default Home;