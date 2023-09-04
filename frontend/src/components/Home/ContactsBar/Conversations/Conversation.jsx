import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import Avatar from "../../../common/Avatar/Avatar"
import { Context } from '../../../Context/Context';

// styles
import "./Conversation.css"

const Conversation = ({ id, username, image, status, highlighted }) => {
  const navigate = useNavigate()
  const { setConversationChosen } = useContext(Context)

  const handleClick = () => {
    setConversationChosen({
      username,
      image,
      status
    })
    navigate(`/dm/${id}`)
  }

  return (
    <div id='home-conversation-container'>
      <button 
        className={highlighted ? 'home-conversation-conversation-highlighted' : 'home-conversation-conversation'} 
        onClick={handleClick}
      >

        <div className='home-conversation-avatar-container'>
          <Avatar image={image} status={status}/>
        </div>
        
        <div className='home-conversation-username-container'>
          <p className='home-conversation-username-text'>
            { username }
          </p>
        </div>
        
      </button>
    </div>
  );
};

export default Conversation