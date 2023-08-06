import React from 'react';

// components
import Avatar from '../../../../common/Avatar/Avatar';

const Sent = ({ username, image, status }) => {
  return (
    <div 
      id='home-right-display-pending-sent-container'
      className='home-right-display-pending-button'
    >
      <div id='home-right-display-pending-user-details'>
        <Avatar image={image} status={status}/>
        <div id='home-right-display-pending-username'>
          <p id='home-right-display-pending-username-username'>{username}</p>
          <p id='home-right-display-pending-username-status'>Outgoing Friend Request</p>
        </div>
        <button>
          reject
        </button>
      </div>
    </div>
  );
};

export default Sent;