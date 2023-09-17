import React from 'react';
import { BiGhost } from "react-icons/bi"

// styles
import "./AddDM.css"

const NoFriends = () => {
  return (
    <div id='create-dm-no-friends-container'>
      <BiGhost size={40}/>
      <p id='create-dm-no-friends-text'>No friends to create a conversation with</p>
    </div>
  );
};

export default NoFriends;