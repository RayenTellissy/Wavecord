import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"
import BeatLoader from "react-spinners/BeatLoader"

// styles
import "./ConfirmationModal.css"

const ConfirmationModal = ({ action, isOpen, onClose, username, removeFriend, blockUser, isUpdating }) => {

  const handleSubmit = () => {
    if(action === "unfriend"){
      return removeFriend()
    }
    blockUser()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bgColor={"blackAlpha.800"} />
      <ModalContent userSelect="none" borderTopRadius={3} bgColor="#313338">
        <ModalHeader>
          <div id='friend-confirmation-modal-header'>
            {action === "unfriend" ? "Remove" : "Block"} {`'${ username }'`}
          </div>
        </ModalHeader>
        <ModalBody>
          <div id='friend-confirmation-modal-body'>
            {action === "unfriend"
            ? (
              <>
                Are you sure you want to permanently remove <span className='friend-confirmation-username'>{ username }</span> from your friends?
              </>
            )
            : (
              <>
                Are you sure you want to block <span className='friend-confirmation-username'>{ username }</span>? Blocking this user will also remove them from your friends list. 
              </>
            )}
          </div>
        </ModalBody>
        <ModalFooter borderBottomRadius={3} h={16} bgColor="#2b2d31">
          <div id='friend-confirmation-modal-footer'>
            <button id='friend-confirmation-modal-cancel' onClick={onClose}>Cancel</button>
            <button id='friend-confirmation-modal-submit' onClick={handleSubmit}>
              {isUpdating
              ? <BeatLoader size={8} color="white" />
              : (action === "unfriend" ? "Remove Friend" : "Block Friend")}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;