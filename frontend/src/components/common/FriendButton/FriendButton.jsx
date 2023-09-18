import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiBlock } from "react-icons/bi"
import { Tooltip } from '@chakra-ui/react';
import axios from 'axios';
import { FaUserMinus } from "react-icons/fa"

// components
import { Context } from '../../Context/Context';
import Avatar from '../Avatar/Avatar';

// styles
import "./FriendButton.css"

const FriendButton = ({ id, username, image, status, setIsUpdating, fetchUsers, toast, conversationId }) => {
  const { user, setConversationChosen } = useContext(Context)
  const navigate = useNavigate()

  const removeFriend = async () => {
    setIsUpdating(true)
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/removeFriend`, {
        remover: user.id,
        removed: id
      })
      await fetchUsers()
      setIsUpdating(false)
      toast({
        description: "Friend removed.",
        status: "success",
        duration: 2000
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  const blockUser = async () => {
    setIsUpdating(true)
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/blockUser`, {
        blocker: user.id,
        blocked: id
      })
      await fetchUsers()
      setIsUpdating(false)
      toast({
        description: "Friend blocked.",
        status: "success",
        duration: 2000
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleNavigation = async () => {
    setConversationChosen({
      username,
      image,
      status
    })
    if (!conversationId) {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/createDM`, {
        currentUser: user.id,
        otherUser: id
      })
      return navigate(`/dm/${response.data.id}`)
    }
    navigate(`/dm/${conversationId}`)
  }

  return (
    <div id='friend-button-main-div'>
      <div id='friend-button-container' onClick={handleNavigation}>
        <div id='friend-button-details-container'>
          <Avatar image={image} status={status} />
          <div id='friend-button-username-status-container'>
            <p id='friend-button-username'>{username}</p>
            <p id='friend-button-status'>
              {status === "ONLINE" ? "Online" : (status === "BUSY" ? "Do Not Disturb" : "Offline")}
            </p>
          </div>
        </div>
        <div>

          <Tooltip
            label="Unfriend"
            placement="top"
            color="white"
            backgroundColor="black"
            fontFamily="GibsonMedium"
            hasArrow={true}
            arrowSize={10}
            padding={3}
            borderRadius={7}
            openDelay={500}
            onClick={removeFriend}
          >
            <button className='friend-button-remove-friend' onClick={removeFriend}>
              <FaUserMinus size={35} />
            </button>
          </Tooltip>

          <Tooltip
            label="Block"
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
            <button className='friend-button-remove-friend' onClick={blockUser}>
              <BiBlock size={35} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};



export default FriendButton;