import React, { useState } from 'react';

// components
import Sidebar from './Sidebar/Sidebar';
import ContactsBar from './ContactsBar/ContactsBar';
import Topbar from './Topbar/Topbar';
import Display from './Screens/Display';
import Turbo from './Turbo/Turbo';

// styles
import "./Home.css"

const Home = () => {
  const [selected,setSelected] = useState("Friends")
  const [selectedScreen,setSelectedScreen] = useState("Online")

  return (
    <div>
      
      <div id='home-container'>
        
        <Sidebar/>
        <ContactsBar selected={selected} setSelected={setSelected}/>

        <div id='home-right-container'>
          <Topbar selected={selected} selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
          {selected === "Turbo" ? <Turbo/> : <Display selectedScreen={selectedScreen}/>}
        </div>

      </div>

    </div>
  );
};

export default Home;