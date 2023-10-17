import React, { useState } from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5"
import { Tooltip } from '@chakra-ui/react';
import BeatLoader from 'react-spinners/BeatLoader';

// components
import Avatar from '../../../../common/Avatar/Avatar';

const Sent = ({ requestId, username, image, status, updateRequestsLocally }) => {
  const [isRemoving,setIsRemoving] = useState(false)

  const removeRequest = async () => {
    try {
      setIsRemoving(true)
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/removeRequest/${requestId}`, {
        withCredentials: true
      })
      updateRequestsLocally(requestId)
      setIsRemoving(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      id='home-right-display-pending-sent-container'
      className='home-right-display-pending-button'
    >
      <div id='home-right-display-pending-user-details-container'>
        <div id='home-right-display-pending-user-details'>
          <Avatar image={image} status={status} />
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
            fontFamily="GibsonMedium"
            hasArrow={true}
            arrowSize={10}
            padding={3}
            borderRadius={7}
            openDelay={500}
          >
            <button
              className='home-right-display-pending-action-button'
              onClick={removeRequest}
            >
              {isRemoving ? <BeatLoader size={8} color="white" /> : <IoClose color='#FFFFFF' size={40} />}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Sent;