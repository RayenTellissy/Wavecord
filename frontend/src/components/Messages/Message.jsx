import React from 'react';
import moment from "moment/moment"
import { Tooltip } from "@chakra-ui/react"

// components
import Avatar from '../common/Avatar/Avatar';

import "./Messages.css"

const Message = ({ username, image, message, type, created_at }) => {
  return (
    <div id='message-container'>
      <div>
        <Avatar image={image} />
      </div>

      <div id='dm-username-message-container'>
        <div id='dm-username-createdat'>
          <p id='dm-message-username'>{username}</p>
          <Tooltip label={moment(created_at).format('dddd, MMMM Do YYYY, h:mm A')}
            placement='top'
            bg="black"
            color="#DDDEE9"
            hasArrow={true}
            arrowSize={10}
            openDelay={500}
            padding={2}
            borderRadius={5}
          >
            <p id='dm-message-createdat'>{moment(created_at).calendar()}</p>
          </Tooltip>
        </div>
        {type === "TEXT"
        ?
        <p id='dm-message-message'>{message}</p>
        :
        <a className='dm-message-link' href={message} target="_blank" rel="noopener noreferrer">
          {message}
          <img src={message} style={{ maxWidth: '100%', marginTop: '5px' }} />
        </a>
        }
      </div>
    </div>
  );
};

export default Message;