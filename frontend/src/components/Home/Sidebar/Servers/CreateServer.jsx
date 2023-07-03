import React, { useContext, useState } from 'react';
import { AddIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
} from '@chakra-ui/react';

// components
import { Context } from '../../../Context/Context';
import Create from './Modals/Create';
import Main from './Modals/Main';
import Join from "./Modals/Join"

// styles
import "./CreateServer.css"

const CreateServer = () => {
  const { user } = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [hovered,setHovered] = useState(false)
  const [screen,setScreen] = useState("main")

  const handleMouseEnter = () => {
    setHovered(true)
  }

  const handleMouseLeave = () => {
    setHovered(false)
  }

  const closeModal = () => {
    onClose() // closing modal
    setScreen("main") // resetting screen
  }

  return (
    <>
      <motion.button id='home-server-bar-create'
        initial={{ y: 0 }}
        whileTap={{ y: 3 }}
        onClick={onOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AddIcon
          id={hovered ? 'home-server-bar-create-icon-hovered' : 'home-server-bar-create-icon-unhovered'}
          style={{ height: 20, width: 20 }} />
      </motion.button>

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay/>
        <ModalContent>
          <ModalCloseButton/>

          {screen === "main" &&
            <Main setScreen={setScreen}/>
          }

          {screen === "create" &&
          <Create
            setScreen={setScreen}
            onClose={onClose}
          />}

          {screen === "join" && 
            <Join 
              setScreen={setScreen}
              onClose={onClose}
            />
          }

        </ModalContent>
      </Modal>
    </>
  )
};

export default CreateServer;