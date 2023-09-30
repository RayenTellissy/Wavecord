import React, { useContext, useState } from 'react';
import { IoMdCheckmark } from "react-icons/io"
import { IoClose } from "react-icons/io5"
import { Tooltip } from '@chakra-ui/react';
import axios from 'axios';

// components
import Avatar from '../../../../common/Avatar/Avatar';
import { Context } from '../../../../Context/Context';

// styles
import "../PendingRequests.css"

const Received = ({ requestId, id, username, image, status, fetchRequests, setIsAccepting }) => {
  const { user } = useContext(Context)
  const [acceptDisabled, setAcceptDisabled] = useState(false)

  const acceptFriendRequest = async () => {
    if (acceptDisabled) return
    setAcceptDisabled(true)
    setIsAccepting(true)
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/acceptFriendRequest`, {
        sender: id,
        requested: user.id
      }, {
        withCredentials: true
      })
      fetchRequests()
      setIsAccepting(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  const rejectFriendRequest = async () => {
    setIsAccepting(true)
    try {
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/removeRequest/${requestId}`, {
        withCredentials: true
      })
      fetchRequests()
      setIsAccepting(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div
      id='home-right-display-pending-received-container'
      className='home-right-display-pending-button'
    >
      <div id='home-right-display-pending-user-details-container'>
        <div id='home-right-display-pending-user-details'>
          <Avatar image={image} status={status} />
          <div id='home-right-display-pending-username'>
            <p id='home-right-display-pending-username-username'>{username}</p>
            <p id='home-right-display-pending-username-status'>Incoming Friend Request</p>
          </div>
        </div>
        <div id='home-right-display-pending-buttons-container'>
          <Tooltip
            label="Accept"
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
              onClick={acceptFriendRequest}
            >
              <IoMdCheckmark size={40} color='#FFFFFF' />
            </button>
          </Tooltip>

          <Tooltip
            label="Decline"
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
            <button className='home-right-display-pending-action-button' onClick={rejectFriendRequest}>
              <IoClose color='#FFFFFF' size={40} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default Received;