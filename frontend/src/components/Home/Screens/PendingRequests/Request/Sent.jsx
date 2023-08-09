import React from 'react';
import { IoClose } from "react-icons/io5"
import { Tooltip } from '@chakra-ui/react';

// components
import Avatar from '../../../../common/Avatar/Avatar';

const Sent = ({ username, image, status }) => {
  return (
    <div 
      id='home-right-display-pending-sent-container'
      className='home-right-display-pending-button'
    >
      <div id='home-right-display-pending-user-details-container'>
        <div id='home-right-display-pending-user-details'>
          <Avatar image={image} status={status}/>
          <div id='home-right-display-pending-username'>
            <p id='home-right-display-pending-username-username'>{username}</p>
            <p id='home-right-display-pending-username-status'>Outgoing Friend Request</p>
          </div>
        </div>
        <div id='home-right-display-pending-buttons-container'>
        <Tooltip
            label="Remove"
            placement="top"
            color="white"
            backgroundColor="black"
            fontFamily="UbuntuMedium"
            hasArrow={true}
            arrowSize={10}
            padding={3}
            borderRadius={7}
            openDelay={500}
          >
            <button className='home-right-display-pending-action-button'>
              <IoClose color='#FFFFFF' size={40}/>
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Sent;