import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"

// styles
import "./PatchNotes.css"

const PatchNotes = ({ isOpen, onOpen, onClose }) => {
  const appVersion = import.meta.env.VITE_APP_VERSION
  const latestVersion = localStorage.getItem("appVersion")

  useEffect(() => {
    // if this is the first time the user launches the app, or last time he was using an outdated version.
    // send a patch notes modal with all the new updates. (latest version is persistent using localstorage)
    if(!latestVersion || (latestVersion && JSON.parse(latestVersion).version !== appVersion)){
      localStorage.setItem("appVersion", JSON.stringify({
        version: appVersion
      }))
      onOpen()
    }
  },[])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"lg"}>
      <ModalOverlay bgColor={"blackAlpha.700"}/>
      <ModalContent bgColor="#313338">
        <ModalHeader bgColor="#2b2d31" borderTopRadius={7}>
          <p id='patch-notes-header-text'>What's New in { appVersion }!</p>
        </ModalHeader>
        <ModalBody padding={5}>
          <div id='patch-notes-new-features-container'>
            <p id='patch-notes-new-features'>NEW FEATURES</p>
            {/* <div id='patch-notes-new-features-line' /> */}
            <p>- Secured Authentication Tokens in httpOnly cookies, for advanced user security.</p>
            <p>- Added log out feature in settings.</p>
            <p>- Added scroll location saving in direct messages and text channels, for enhanced user experience.</p>
            <p>- Added user settings with many features for the user to customize his experience.</p>
          </div>
          <div id='patch-notes-bug-fixes-container'>
            <p id='patch-notes-bug-fixes-header'>BUG FIXES</p>
            <p>- Fixed notifications not working in some cases.</p>
            <p>- Fixed messages being sorted randomly in conversations.</p>
            <p>- Fixed users being able to chat in servers after being banned or kicked.</p>
            <p>- Fixed font issues in some areas of the app.</p>
            <p>- Other QoL and user experience fixes.</p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};

export default PatchNotes;