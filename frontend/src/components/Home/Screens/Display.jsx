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
  const [showSearch,setShowSearch] = useState(false)
  const displays = {
    Online: <OnlineFriends query={query} setShowSearch={setShowSearch} />,
    All: <AllFriends query={query} setShowSearch={setShowSearch} />,
    Pending: <PendingRequests query={query} setShowSearch={setShowSearch} />,
    Blocked: <Blocked query={query} setShowSearch={setShowSearch} />,
    AddFriend: <AddFriend setShowSearch={setShowSearch} />
  }
  
  return <>
    {showSearch && selectedScreen !== "AddFriend" && <SearchBar setQuery={setQuery}/>}

    {displays[selectedScreen]}
  </>
};

export default Display;