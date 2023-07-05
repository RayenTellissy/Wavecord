import React from 'react';
import moment from "moment/moment"

// components
import Avatar from '../common/Avatar/Avatar';

import "./Messages.css"

const Message = ({ username, image, message, created_at }) => {
  return (
    <div id='message-container'>
      <div>
        <Avatar image={image} />
      </div>

      <div id='dm-username-message-container'>
        <div id='dm-username-createdat'>
          <p id='dm-message-username'>{username}</p>
          <p id='dm-message-createdat'>{moment(created_at).calendar()}</p>
        </div>
        <p id='dm-message-message'>{message}</p>
      </div>
    </div>
  );
};

export default Message;