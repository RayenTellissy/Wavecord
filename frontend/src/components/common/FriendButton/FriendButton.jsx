import React, { useContext, useState } from 'react';
import axios from 'axios';
import { BiBlock } from "react-icons/bi"
import { Tooltip, useDisclosure } from '@chakra-ui/react';
import { FaUserMinus } from "react-icons/fa"

// components
import { Context } from '../../Context/Context';
import Avatar from '../Avatar/Avatar';
import ConfirmationModal from './ConfirmationModal/ConfirmationModal';

// styles
import "./FriendButton.css"

const FriendButton = ({ id, username, image, status, isUpdating, setIsUpdating, fetchUsers, toast, conversationId }) => {
  const { user, setConversationChosen, setCurrentConversationId, setDisplay, setSelected, fetchConversations } = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [action,setAction] = useState(null)

  const openUnfriend = (e) => {
    e.stopPropagation() // using stopPropagation so the container div doesnt open (navigates to conversation)
    setAction("unfriend")
    onOpen()
  }
  
  const openBlock = (e) => {
    e.stopPropagation() // using stopPropagation so the container div doesnt open (navigates to conversation)
    setAction("block")
    onOpen()
  }

  const removeFriend = async () => {
    setIsUpdating(true)
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/removeFriend`, {
        remover: user.id,
        removed: id
      }, {
        withCredentials: true
      })
      await fetchUsers()
      setIsUpdating(false)
      toast({
        description: "Friend removed.",
        status: "success",
        duration: 1500
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
      }, {
        withCredentials: true
      })
      await fetchUsers()
      setIsUpdating(false)
      toast({
        description: "Friend blocked.",
        status: "success",
        duration: 1500
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleNavigation = async () => {
    setSelected("")
    setConversationChosen({
      id,
      username,
      image,
      status
    })
    if (!conversationId) {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/createDM`, {
        currentUser: user.id,
        otherUser: id
      }, {
        withCredentials: true
      })
      fetchConversations()
      setCurrentConversationId(response.data.id)
      return setDisplay("directMessages")
    }
    setCurrentConversationId(conversationId)
    setDisplay("directMessages")
  }

  return (
    <div id='friend-button-main-div'>
      <ConfirmationModal
        action={action}
        isOpen={isOpen}
        onClose={onClose}
        username={username}
        removeFriend={removeFriend}
        blockUser={blockUser}
        isUpdating={isUpdating}
      />
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
          >
            <button className='friend-button-remove-friend' onClick={openUnfriend}>
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
            <button className='friend-button-remove-friend' onClick={openBlock}>
              <BiBlock size={35} />
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};



export default FriendButton;