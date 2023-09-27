import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { FaUserGroup } from 'react-icons/fa6';

// components
import TopbarButton from './TopbarButton';
import { Context } from '../../Context/Context';

// styles
import "./Topbar.css"

const Topbar = ({ selected, selectedScreen, setSelectedScreen }) => {
  const { user, socket, friendRequestNotifications, setFriendRequestNotifications } = useContext(Context)

  useEffect(() => {
    fetchFriendRequestNotifications()
  },[])

  useEffect(() => {
    socket.on("receive_friend_request_notification", () => {
      fetchFriendRequestNotifications()
    })
    return () => socket.off("receive_friend_request_notification")
  },[socket])

  const fetchFriendRequestNotifications = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/notifications/fetchFriendRequestNotifications/${user.id}`)
      setFriendRequestNotifications(response.data.requests)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-right-topbar'>
      {selected === "Friends" ? <div id='home-right-topbar-friends'>
        <FaUserGroup size={30} color='#A1A1A1'/>
        <p id='home-right-topbar-friends-text'>Friends</p>
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
      </div> : <div>
        Turbo
      </div>}
    </div>
  );
};

export default Topbar;