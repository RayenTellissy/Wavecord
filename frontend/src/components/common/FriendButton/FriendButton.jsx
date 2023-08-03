import React from 'react';

// styles
import "./FriendButton.css"
import Avatar from '../Avatar/Avatar';

const FriendButton = ({ username, image, status }) => {
  return (
    <button>
      <div id='friend-button-container'>
        <Avatar image={image} status={status}/>
        <div id='friend-button-username-status-container'>
          <p id='friend-button-username'>{username}</p>
          <p id='friend-button-status'>
            {status === "ONLINE" ? "Online" : (status === "BUSY" ? "Do Not Disturb" : "Offline")}
          </p>
        </div>
      </div>
    </button>
  );
};



export default FriendButton;