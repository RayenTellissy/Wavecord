import React, { useState } from 'react';
import { FaUserGroup } from 'react-icons/fa6';

// components
import Sidebar from './Sidebar/Sidebar';
import ContactsBar from './ContactsBar/ContactsBar';

// styles
import "./Home.css"

const Home = () => {
  const [selected,setSelected] = useState("Friends")

  return (
    <div>
      
      <div id='home-container'>
        
        <Sidebar/>
        <ContactsBar selected={selected} setSelected={setSelected}/>

        <div id='home-right-container'>
          <div id='home-right-topbar'>
            <div id='home-right-topbar-friends'>
              <FaUserGroup size={40} color='#A1A1A1'/>
              <p id='home-right-topbar-friends-text'>Friends</p>
              <span id='home-right-topbar-friends-seperator'/>
              <button className='home-right-topbar-friends-button'>Online</button>
              <button className='home-right-topbar-friends-button'>All</button>
              <button className='home-right-topbar-friends-button'>Pending</button>
              <button className='home-right-topbar-friends-button'>Blocked</button>
              <button id='home-right-topbar-friends-add-button'>Add friend</button>
            </div>
          </div>
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