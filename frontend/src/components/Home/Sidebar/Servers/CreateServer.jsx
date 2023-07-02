import React, { useState } from 'react';
import { AddIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { 
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  } from '@chakra-ui/react';

import { faKeySkeleton } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./CreateServer.css"

const CreateServer = () => {
  const [hovered,setHovered] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  return (
    <>
      <button id='home-server-bar-create'
        onClick={onOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AddIcon
          id={hovered ? 'home-server-bar-create-icon-hovered' : 'home-server-bar-create-icon-unhovered'}
          style={{ height: 20, width: 20 }} />
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalCloseButton/>
          <ModalHeader fontSize={35} alignSelf="center" fontFamily="UbuntuBold">Create Server</ModalHeader>
          <ModalBody>
            <p id='home-server-bar-modal-text'>Your server is where you and your friends hang out. Make yours and start talking.</p>
            <button id='home-server-bar-modal-create'>
              <FontAwesomeIcon icon={faKeySkeleton} />
              <p id='home-server-bar-modal-create-text'>Create My Own</p>
              <ChevronRightIcon boxSize={10}/>
            </button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
};

export default CreateServer;