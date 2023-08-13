import React, { useContext } from 'react';
import { IoClose } from "react-icons/io5"
import { Tooltip } from "@chakra-ui/react"

// components
import Avatar from '../../../common/Avatar/Avatar';
import { Context } from '../../../Context/Context';

// styles
import "./Blocked.css"
import axios from 'axios';

const BlockedUser = ({ id, username, image, status, setIsUnblocking, fetchBlocks }) => {
  const { user } = useContext(Context)

  const unblockUser = async () => {
    setIsUnblocking(true)
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/unblockUser`,{
        blocker: user.id,
        blocked: id
      },{
        withCredentials: true
      })
      fetchBlocks()
      setIsUnblocking(false)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <button>
      <div id='blockeduser-button-container'>
        <div id='blockeduser-button-details-container'>
          <Avatar image={image} status={status}/>
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
            fontFamily="UbuntuMedium"
            hasArrow={true}
            arrowSize={10}
            padding={3}
            borderRadius={7}
            openDelay={500}
          >
            <button id='blockeduser-button-unblock' onClick={unblockUser}>
              <IoClose color='#FFFFFF' size={40}/>
            </button>
          </Tooltip>
        </div>
      </div>
    </button>
  );
};

export default BlockedUser;