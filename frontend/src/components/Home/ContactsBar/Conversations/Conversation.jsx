import React, { useContext } from 'react';

// components
import Avatar from "../../../common/Avatar/Avatar"
import { Context } from '../../../Context/Context';

// styles
import "./Conversation.css"

const Conversation = ({ id, userId, username, image, status, highlighted, setSelected }) => {
  const { setConversationChosen, setCurrentConversationId, setDisplay } = useContext(Context)

  const handleClick = () => {
    setConversationChosen({
      id: userId,
      username,
      image,
      status,
      conversationId: id
    })
    setSelected("")
    setCurrentConversationId(id)
    setDisplay("directMessages")
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