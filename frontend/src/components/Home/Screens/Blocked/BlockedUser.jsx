import React, { useContext, useState } from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5"
import { Tooltip } from "@chakra-ui/react"
import BeatLoader from "react-spinners/BeatLoader"

// components
import Avatar from '../../../common/Avatar/Avatar';
import { Context } from '../../../Context/Context';

// styles
import "./Blocked.css"

const BlockedUser = ({ id, username, image, status, fetchBlocks }) => {
  const { user } = useContext(Context)
  const [isUnblocking,setIsUnblocking] = useState(false)

  const unblockUser = async () => {
    try {
      setIsUnblocking(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/unblockUser`, {
        blocker: user.id,
        blocked: id
      }, {
        withCredentials: true
      })
      fetchBlocks()
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div id='blocked-user-button'>
      <div id='blockeduser-button-container'>
        <div id='blockeduser-button-details-container'>
          <Avatar image={image} status={status} />
          <div id='blockeduser-button-username-status-container'>
            <p id='blockeduser-button-username'>{username}</p>
            <p id='blockeduser-button-status'>
              {status === "ONLINE" ? "Online" : (status === "BUSY" ? "Do Not Disturb" : "Offline")}
            </p>
          </div>
        </div>
        <div id='blockeduser-button-buttons-container'>
          <Tooltip
            label="Unblock"
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
            <button id='blockeduser-button-unblock' onClick={unblockUser}>
              {isUnblocking ? <BeatLoader size={8} color='white' /> : <IoClose color='#FFFFFF' size={40} />}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default BlockedUser;