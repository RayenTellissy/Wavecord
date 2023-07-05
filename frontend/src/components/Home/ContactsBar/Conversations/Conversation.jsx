import React from 'react';
import { useNavigate } from 'react-router-dom';

// components
import Avatar from "../../../common/Avatar/Avatar"

// styles
import "./Conversation.css"

const Conversation = ({ id, username, image, status, highlighted }) => {
  const navigate = useNavigate()

  return (
    <div id='home-conversation-container'>
      <button 
        className={highlighted ? 'home-conversation-conversation-highlighted' : 'home-conversation-conversation'} 
        onClick={() => navigate(`/dm/${id}`)}
      >

        <div className='home-conversation-avatar-container'>
          <Avatar image={image} status={status}/>
        </div>
        
        <div className='home-conversation-username-container'>
          <p className='home-conversation-username-text'>
            {username}
          </p>
        </div>
        
      </button>
    </div>
  );
};

export default Conversation