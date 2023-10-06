import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

// styles
import "./PatchNotes.css"

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
      <ModalContent bgColor="#313338">
        <ModalHeader>
          <p id='patch-notes-header-text'>What's New in { appVersion }</p>
        </ModalHeader>
        <ModalBody>
          <div id='patch-notes-new-features-container'>
            <p id='patch-notes-new-features'>NEW FEATURES</p>
            {/* <div id='patch-notes-new-features-line' /> */}
          </div>
        </ModalBody>
        <ModalFooter bgColor="#2b2d31">

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
};

export default PatchNotes;