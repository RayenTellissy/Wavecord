import React from 'react';
import { Modal, ModalBody, ModalContent } from "@chakra-ui/react"

// styles
import "./SaveCheck.css"

const SaveCheck = ({ isOpen, saveCb, resetCb }) => {
  return (
    <Modal isOpen={isOpen} size="2xl" blockScrollOnMount={false} trapFocus={false}>
        <ModalContent placeSelf="end">
          <ModalBody
            borderRadius={4}
            alignItems="center"
            bg="#181414"
            display="flex"
            justifyContent="space-between"
            padding={3}
          >
            <div>
              <p id='server-settings-modal-save-check-text'>Careful -- you have unsaved changes!</p>
            </div>
            <div>
              <button id='server-settings-modal-save-check-reset' onClick={resetCb}>Reset</button>
              <button id='server-settings-modal-save-check-save' onClick={saveCb}>Save Changes</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};

export default SaveCheck;