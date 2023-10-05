import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

const PatchNotes = ({ isOpen, onOpen, onClose }) => {
  const appVersion = import.meta.env.VITE_APP_VERSION
  const latestVersion = localStorage.getItem("appVersion")

  if(!latestVersion || (latestVersion && JSON.parse(latestVersion).version !== appVersion)){
    localStorage.setItem("appVersion", JSON.stringify({
      version: appVersion
    }))
    onOpen()
  }
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>
          <p>What's New in {appVersion}</p>
        </ModalHeader>
        <ModalBody>

        </ModalBody>
        <ModalFooter>

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
};

export default PatchNotes;