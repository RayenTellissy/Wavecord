import React from 'react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import {
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react"

const Main = ({ setScreen }) => {
  return <>
    <ModalHeader fontSize={35} alignSelf="center" fontFamily="UbuntuBold">Create Server</ModalHeader>
    <ModalBody>
      <p className='home-server-bar-modal-text'>Your server is where you and your friends hang out. Make yours and start talking.</p>
      <button id='home-server-bar-modal-create' onClick={() => setScreen("create")}>
        <p id='home-server-bar-modal-create-text'>Create My Own</p>
        <ChevronRightIcon boxSize={10}/>
      </button>
    </ModalBody>
    <ModalFooter>
      <div id='home-server-bar-modal-seperator'>
        <p className='home-server-bar-modal-seperator-text'>Have an invite already?</p>
        <button id='home-server-bar-modal-seperator-join'>
          Join a Server
        </button>
      </div>
    </ModalFooter>
  </>
};

export default Main;