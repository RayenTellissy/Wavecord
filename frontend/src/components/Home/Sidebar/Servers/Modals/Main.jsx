import React from 'react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react"
import { FaKey } from "react-icons/fa"

const Main = ({ setScreen }) => {
  return <>
    <ModalHeader fontSize={35} alignSelf="center" fontFamily="UbuntuBold">Create Server</ModalHeader>
    <ModalBody>
      <p className='home-server-bar-modal-text'>Your server is where you and your friends hang out. Make yours and start talking.</p>
      <button id='home-server-bar-modal-create' onClick={() => setScreen("create")}>
        <FaKey size={30}/>
        <p id='home-server-bar-modal-create-text'>Create My Own</p>
        <ChevronRightIcon id='home-server-bar-modal-create-chev' boxSize={10}/>
      </button>
    </ModalBody>
    <ModalFooter>
      <div id='home-server-bar-modal-seperator'>
        <p className='home-server-bar-modal-seperator-text'>Have an invite already?</p>
        <button id='home-server-bar-modal-seperator-join' onClick={() => setScreen("join")}>
          Join a Server
        </button>
      </div>
    </ModalFooter>
  </>
};

export default Main;