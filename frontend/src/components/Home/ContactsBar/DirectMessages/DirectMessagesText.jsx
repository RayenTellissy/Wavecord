import React from 'react';
import { AddIcon } from "@chakra-ui/icons"

// styles
import "./DirectMessagesText.css"

const DirectMessagesText = () => {
  return (
    <div id='home-contacts-side-messages'>
      <p id='home-contacts-side-message-text'>
        DIRECT MESSAGES
      </p>
      <button>
        <AddIcon/>
      </button>
    </div>
  );
};

export default DirectMessagesText;