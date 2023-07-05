import React from 'react';

// components
import Avatar from '../../common/Avatar/Avatar';

// styles
import "./OtherUsers.css"

const OtherUsers = ({ username, image, status }) => {

  return (
    <div id='conversation-other-users-container'>
      <div id='conversation-other-users-details'>
        <Avatar image={image} status={status}/> 
        <p id='conversation-other-users-username'>{username}</p>
      </div>
    </div>
  );
};

export default OtherUsers;