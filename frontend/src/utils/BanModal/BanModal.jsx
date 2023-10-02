import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

// styles
import "./BanModal.css"

const BanModal = ({ bannedFrom, onClose, isOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay bgColor="blackAlpha.800"/>
      <ModalContent bgColor="#313338">
        <ModalHeader display="flex" justifyContent="center">
          <p id='ban-modal-header-text'>
            {bannedFrom?.type === "ban" ? 'You have been banned from' : 'You have been kicked from'} { bannedFrom?.name }
          </p>
        </ModalHeader>
        <ModalBody display="flex" justifyContent="center">
          <p id='ban-modal-body-text'>{bannedFrom?.reason ? bannedFrom.reason : "No Reason Provided."}</p>
        </ModalBody>
        <ModalFooter height={70} display="flex" justifyContent="center" bgColor="#2b2d31" borderBottomRadius={10}>
          <button id='ban-modal-footer-button' onClick={onClose}>I Understand</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BanModal;