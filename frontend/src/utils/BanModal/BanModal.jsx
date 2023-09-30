import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

const BanModal = ({ bannedFrom, onClose, isOpen }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bgColor={"blackAlpha.800"}/>
      <ModalContent>
        <ModalHeader>
          <p>
            You have been banned from {bannedFrom}
          </p>
        </ModalHeader>
      </ModalContent>
    </Modal>
  );
};

export default BanModal;