import React, { useState } from 'react';

// components
import OnlineFriends from './OnlineFriends/OnlineFriends';
import AllFriends from './AllFriends/AllFriends';
import PendingRequests from './PendingRequests/PendingRequests';
import Blocked from './Blocked/Blocked';
import AddFriend from './AddFriend/AddFriend';
import SearchBar from './SearchBar/SearchBar';

// styles
import "./Display.css"

const Display = ({ selectedScreen }) => {
  const [query,setQuery] = useState("")
  
  return <>
    <SearchBar setQuery={setQuery}/>

    {selectedScreen === "Online"
    ? <OnlineFriends query={query}/>
    : (selectedScreen === "All"
    ? <AllFriends/>
    : (selectedScreen === "Pending"
    ? <PendingRequests/>
    : (selectedScreen === "Blocked" ? <Blocked/> : <AddFriend/>)))}
  </>
};

export default Display;