import React from 'react';

// components
import Avatar from '../../../common/Avatar/Avatar';

// styles
import "./Blocked.css"

const BlockedUser = ({ username, image, status }) => {
  return (
    <button>
      <div id='blockeduser-button-container'>
        <Avatar image={image} status={status}/>
        <div id='blockeduser-button-username-status-container'>
          <p id='blockeduser-button-username'>{username}</p>
          <p id='blockeduser-button-status'>
            {status === "ONLINE" ? "Online" : (status === "BUSY" ? "Do Not Disturb" : "Offline")}
          </p>
        </div>
      </div>
    </button>
  );
};

export default BlockedUser;