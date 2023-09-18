import React from 'react';

// styles
import "./ConversationStart.css"

const ConversationStart = ({ username, image }) => {
  return (
    <div id='conversation-start-container'>
      <div id='conversation-start-avatar-container'>
        <img id='conversation-start-image' src={image} />
        <p id='conversation-start-username'>{ username }</p>
      </div>
      <p id='conversation-start-text'>
        This is the beginning of your direct message history with <span id='conversation-start-text-username'>
          { username }
        </span>.
      </p>
    </div>
  );
};

export default ConversationStart;