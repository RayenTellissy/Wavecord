import React, { useState } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, useDisclosure } from "@chakra-ui/react"

// components
import Avatar from "../../../../../common/Avatar/Avatar"

// styles
import "./BannedUser.css"

const BannedUser = ({ id, username, image, user, serverId, fetchUsers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading,setIsLoading] = useState(false)

  const unbanUser = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/unbanUser`,{
        remover: user.id,
        removed: id,
        serverId
      }, {
        withCredentials: true
      })
    await fetchUsers()
      setIsLoading(false)
      onClose()
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-settings-bans-banned-user' onClick={onOpen}>
      <div id='server-settings-bans-avatar-container'>
        <Avatar image={image}/>
        <p>{ username }</p>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bgColor={"blackAlpha.800"}/>
        <ModalContent borderTopRadius={3} bgColor="#313338">
          <ModalHeader >
            <div id='unban-modal-username'>
              { username }
            </div>
          </ModalHeader>
          <ModalFooter padding={4} bgColor="#2b2d31" borderBottomRadius={3} height={70}>
            <div id='unban-modal-buttons-container'>
              <button id='unban-modal-done-button' onClick={onClose}>Done</button>
              <button id='unban-modal-revoke-button' onClick={unbanUser}>
                {isLoading ? "Loading..." : "Revoke Ban"}
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BannedUser;