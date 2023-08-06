import React from 'react';
import { IoMdCheckmark } from "react-icons/io"
import { IoClose } from "react-icons/io5"

// components
import Avatar from '../../../../common/Avatar/Avatar';

// styles
import "../PendingRequests.css"

const Received = ({ username, image, status }) => {
  return (
    <div 
      id='home-right-display-pending-received-container'
      className='home-right-display-pending-button'
    >
      <div id='home-right-display-pending-user-details-container'>
        <div id='home-right-display-pending-user-details'>
          <Avatar image={image} status={status}/>
          <div id='home-right-display-pending-username'>
            <p id='home-right-display-pending-username-username'>{username}</p>
            <p id='home-right-display-pending-username-status'>Incoming Friend Request</p>
          </div>
        </div>
        <div id='home-right-display-pending-buttons-container'>
          <button className='home-right-display-pending-action-button'>
            <IoMdCheckmark size={40} color='#FFFFFF'/>
          </button>
          <button className='home-right-display-pending-action-button'>
            <IoClose color='#FFFFFF' size={40}/>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Received;