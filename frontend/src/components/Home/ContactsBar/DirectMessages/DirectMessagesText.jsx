import React from 'react';
import { AddIcon } from "@chakra-ui/icons"
import axios from 'axios';

// styles
import "./DirectMessagesText.css"

const DirectMessagesText = ({ id }) => {

  const fetchFriends = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchAllFriends`,{
        id: id
      })

    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <div id='home-contacts-side-messages'>
      <p id='home-contacts-side-message-text'>
        DIRECT MESSAGES
      </p>
      <button>
        <AddIcon onClick={fetchFriends}/>
      </button>
    </div>
  );
};

export default DirectMessagesText;