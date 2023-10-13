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
import Server from '../Server/Server';

// styles
import "./Home.css"

const Home = () => {
  const location = useLocation()
  const { currentConversationId, currentServerId, display, selected, setSelected } = useContext(Context)
  const [selectedScreen,setSelectedScreen] = useState(location.state?.selected ? location.state?.selected : "Online")
  const displays = {
    directMessages: <Messages />,
    server: <Server />,
    home: <>
      <Topbar selected={selected} selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
      {selected === "Turbo" ? <Turbo/> : <Display selectedScreen={selectedScreen}/>}
    </>
  }

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
          {displays[display]}
        </div>

      </div>

    </div>
  );
};

export default Home;