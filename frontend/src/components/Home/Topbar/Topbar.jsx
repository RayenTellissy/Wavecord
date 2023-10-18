import React, { useContext, useEffect } from 'react';
import { FaBolt, FaUserGroup } from 'react-icons/fa6';

// components
import TopbarButton from './TopbarButton';
import { Context } from '../../Context/Context';

// styles
import "./Topbar.css"

const Topbar = ({ selected, selectedScreen, setSelectedScreen }) => {
  const { friendRequestNotifications, fetchFriendRequestNotifications } = useContext(Context)

  useEffect(() => {
    fetchFriendRequestNotifications()
  },[])

  return (
    <div id='home-right-topbar'>
      {selected === "Friends" ? <div className='home-right-topbar-content'>
        <FaUserGroup size={30} color='#A1A1A1'/>
        <p className='home-right-topbar-content-text'>Friends</p>
        <span id='home-right-topbar-friends-seperator'/>
        <TopbarButton text="Online" selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
        <TopbarButton text="All" selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
        <TopbarButton
          text="Pending"
          selectedScreen={selectedScreen}
          setSelectedScreen={setSelectedScreen}
          notifications={friendRequestNotifications}
        />
        <TopbarButton text="Blocked" selectedScreen={selectedScreen} setSelectedScreen={setSelectedScreen}/>
        <button 
          onClick={() => setSelectedScreen("AddFriend")} 
          id={selectedScreen === "AddFriend" 
          ? 'home-right-topbar-friends-add-button-selected' 
          : 'home-right-topbar-friends-add-button'}
        >
          Add Friend
        </button>
      </div> : <div className='home-right-topbar-content'>
        <FaBolt size={30} color='#A1A1A1'/>
        <p className='home-right-topbar-content-text'>Turbo</p>
      </div>}
    </div>
  );
};

export default Topbar;