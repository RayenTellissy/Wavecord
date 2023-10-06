import React from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

// styles
import "./PatchNotes.css"

const PatchNotes = ({ isOpen, onOpen, onClose }) => {
  const appVersion = import.meta.env.VITE_APP_VERSION
  const latestVersion = localStorage.getItem("appVersion")

  // if this is the first time the user launches the app, or last time he was using an outdated version.
  // send a patch notes modal with all the new updates. (latest version is persistent using localstorage)
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
            <p>Secured Authentication Tokens in httpOnly cookies, for advanced user security.</p>
            <p>Added log out feature in settings.</p>
            <p>Added scrolling location saving in direct messages and text channels, for enhanced user experience.</p>
          </div>
          <p>Bug Fixes</p>
          <p>Fixed notifications not working sometimes.</p>
          <p>Fixed messages being sorted randomly.</p>
          <p>Fixed users not getting removed instantly from servers after being banned or kicked.</p>
          <p>Other QoL and user experience fixes.</p>
        </ModalBody>
        <ModalFooter bgColor="#2b2d31">

        </ModalFooter>
      </ModalContent>
    </Modal>
  )
};

export default PatchNotes;