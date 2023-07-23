import React from 'react';

// components
import OnlineFriends from './OnlineFriends/OnlineFriends';
import AllFriends from './AllFriends/AllFriends';
import PendingRequests from './PendingRequests/PendingRequests';
import Blocked from './Blocked/Blocked';
import AddFriend from './AddFriend/AddFriend';

const Display = ({ selectedScreen }) => {
  
  return <>
    {selectedScreen === "Online" 
    ? <OnlineFriends/> 
    : (selectedScreen === "All" 
    ? <AllFriends/>
    : (selectedScreen === "Pending" 
    ? <PendingRequests/> 
    : (selectedScreen === "Blocked" ? <Blocked/> : <AddFriend/>)))}
  </>
};

export default Display;