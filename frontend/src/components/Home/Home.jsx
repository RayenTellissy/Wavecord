import React, { useState } from 'react';

// components
import Sidebar from './Sidebar/Sidebar';
import ContactsBar from './ContactsBar/ContactsBar';
import Topbar from './Topbar/Topbar';
import Display from './Screens/Display';

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
          <Topbar selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
          <Display selectedScreen={selectedScreen}/>
          {/* <button onClick={async () => {
            await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`, { withCredentials: true })
          }}>
            log out
          </button> */}
        </div>

      </div>

    </div>
  );
};

export default Home;