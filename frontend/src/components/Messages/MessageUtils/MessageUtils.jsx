import React from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react';

// components
import DeleteButton from './DeleteButton/Deletebutton';
import EditButton from './EditButton/EditButton';
import Avatar from '../../common/Avatar/Avatar';

// styles
import "./MessageUtils.css"

const MessageUtils = ({ hovered, deleteMessage, editMessage, message, image }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSubmit = () => {
    onClose()
    deleteMessage()
  }

  return (
    <>
      {hovered && <div id='message-util-buttons'>
        <EditButton callback={editMessage} />
        <DeleteButton callback={onOpen}/>
      </div>}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bgColor="blackAlpha.800" />
        <ModalContent borderTopRadius={3} bgColor="#313338">
          <ModalHeader>
            <p id='message-util-header-text'>Delete Message</p>
          </ModalHeader>
          <ModalBody>
            <div id='message-util-modal-body'>
              Are you sure you want to delete this message?
              <div id='message-util-message-container'>
                <div id='message-util-avatar-container'>
                  <Avatar image={image} />
                </div>
                <p id='message-util-message'>{ message }</p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter borderBottomRadius={3} bgColor="#2b2d31" h={16}>
            <div>
              <button id='message-util-modal-cancel' onClick={onClose}>Cancel</button>
              <button id='message-util-modal-delete' onClick={handleSubmit}>
                Delete
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MessageUtils;