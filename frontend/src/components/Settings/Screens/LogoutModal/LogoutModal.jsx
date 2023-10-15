import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

// styles
import "./LogoutModal.css"

const LogoutModal = ({ isOpen, onClose, callback }) => {

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bgColor={"blackAlpha.800"} />
      <ModalContent borderTopRadius={3} bgColor="#313338">
        <ModalHeader>
          <div id='logout-modal-header'>Log out</div>
        </ModalHeader>
        <ModalBody>
          <div id='logout-modal-body'>
            Are you sure you want to logout?
          </div>
        </ModalBody>
        <ModalFooter bgColor="#2b2d31" borderBottomRadius={3} h={16}>
          <div id='logout-modal-footer'>
            <button id='logout-modal-cancel-button' onClick={onClose}>Cancel</button>
            <button id='logout-modal-logout-button' onClick={callback}>Log Out</button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};


export default LogoutModal;