import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

// styles
import "./OwnsServerModal.css"

const OwnsServerModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bgColor={"blackAlpha.800"}/>
      <ModalContent borderTopRadius={3} bgColor={"#313338"}>
        <ModalHeader>
          <div id='delete-account-header'>
            You Own Servers!
          </div>
        </ModalHeader>
        <ModalBody>
          <p id='owns-servers-body-text'>In order to delete or disable your account you must first transfer ownership of all servers that you own.</p>
        </ModalBody>
        <ModalFooter borderBottomRadius={3} h={16} bgColor={"#2a2c31"}>
          <button id='owns-servers-done-button' onClick={onClose}>Okay</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OwnsServerModal;