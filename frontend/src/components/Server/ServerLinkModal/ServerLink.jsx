import React, { useState } from 'react';
import axios from 'axios';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react'

// styles
import "./ServerLink.css"

const ServerLink = ({ isOpen, onOpen, onClose, server, user, fetchData }) => {
  const toast = useToast()
  const [isResetting,setIsResetting] = useState(false)
  
  const handleCopy = () => {
    if(isResetting) return
    navigator.clipboard.writeText(server.server_link)
    toast({
      title: "Copied to Clipboard.",
      status: "success",
      duration: 1500
    })
  }

  const handleResetLink = async () => {
    if(user.id !== server.ownerId){
      return toast({
        title: "You don't have server privileges to do that.",
        status: "warning",
        duration: 2000
      })
    }
    try {
      setIsResetting(true)
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/servers/resetServerLink`,{
        server_link: server.server_link,
        id: user.id,
        ownerId: server.ownerId
      },{
        withCredentials: true
      })
      // refreshing server data
      await fetchData()
      setIsResetting(false)
      toast({
        title: "Server link has been reset.",
        status: "success",
        duration: 2000
      })
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <Modal isOpen={isOpen} onOpen={onOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay/>
      <ModalContent borderRadius={10} bg="#313338">
        <ModalHeader>
          <p id='server-link-welcome-text'>Invite People to </p>
          <p id='server-link-welcome-server-name'>{ server.name }</p>
        </ModalHeader>
        <ModalBody>
          <div id='server-link-input-container'>
            <input
              id='server-link-input'
              type='text'
              value={!isResetting ? server.server_link : "Resetting Link..."}
              readOnly
            />
            <button
              className='server-link-copy-button'
              id={!isResetting ? 'server-link-copy-button-active': 'server-link-copy-button-disabled'}
              onClick={handleCopy}
            >
              <p id={!isResetting ? 'server-link-copy-button-text-active' : 'server-link-copy-button-text-disabled'}>
                Copy
              </p>
            </button>
          </div>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center">
          <button id='server-link-reset-button' onClick={handleResetLink}>
            <p>Reset Link</p>
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ServerLink;