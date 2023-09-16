import React from 'react';
import { FaUserGroup } from 'react-icons/fa6';

// components
import TopbarButton from './TopbarButton';

// styles
import "./Topbar.css"

const Topbar = ({ selected, selectedScreen, setSelectedScreen }) => {

  return (
    <div id='home-right-topbar'>
      {selected === "Friends" ? <div id='home-right-topbar-friends'>
        <FaUserGroup size={30} color='#A1A1A1'/>
        <p id='home-right-topbar-friends-text'>Friends</p>
        <span id='home-right-topbar-friends-seperator'/>
        <TopbarButton text="Online" selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
        <TopbarButton text="All" selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
        <TopbarButton text="Pending" selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
        <TopbarButton text="Blocked" selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
        <button 
          onClick={() => setSelectedScreen("AddFriend")} 
          id={selectedScreen === "AddFriend" 
          ? 'home-right-topbar-friends-add-button-selected' 
          : 'home-right-topbar-friends-add-button'}
        >
          Add Friend
        </button>
      </div> : <div>
        Turbo
      </div>}
    </div>
  );
};

export default Topbar;