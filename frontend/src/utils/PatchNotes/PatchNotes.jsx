import React, { useEffect } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton } from "@chakra-ui/react"

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
        <ModalCloseButton />
        <ModalHeader bgColor="#2b2d31" borderTopRadius={7}>
          <p id='patch-notes-header-text'>What's New in { appVersion }!</p>
        </ModalHeader>
        <ModalBody padding={5} maxHeight="600px" overflowY="auto" className='default-scrollbar'>
          <div id='patch-notes-new-features-container'>
            <p id='patch-notes-new-features'>NEW FEATURES</p>
              <p>- You are now able to update your message after sending them.</p>
              <p>- Added Image Uploading in user settings</p>
              <p>- added new sign up input indicators, to ease the process of signing up</p>
              <p>- the user will now receive a notification when one of his friend requests get accepted</p>
              <p>- added an indicator to let the user know if his internet cut off</p>
              <p>- you can now become a turbo member for 2.99$ and unlock unique features to the app (doesn't actually work because stripe requires you to have a company)</p>
          </div>
          <div id='patch-notes-bug-fixes-container'>
            <p id='patch-notes-bug-fixes-header'>BUG FIXES</p>
              <p>- fixed sorting of conversations in contacts bar not working when chatting in a conversation.</p>
              <p>- fixed status not updating instantly for other users when changing it.</p>
              <p>- fixed a bug where you can select messages by holding the mouse and hovering</p>
              <p>- fixed a bug where if you delete a message you get scrolled down to the bottom of the conversation</p>
              <p>- fixed a bug where a user's status does not change in server members locally when he changes it</p>
              <p>- fixed users being sorted randomly in members bar of every server</p>
              <p>- fixed a bug where clicking on a message notification makes you unable to click friends button in the contacts bar</p>
              <p>- fixed a bug where blocked users were able to send others users that blocked them messages</p>
              <p>- fixed a bug where users could enter a private channel when they're not an admin</p>
              <p>- fixed 'login with google' and 'login with facebook' not working.</p>
              <p>- fixed a bug where a user that has been kicked or banned from a server can use the browser developer tools to get access back to the server.</p>
              <p>- fixed a bug where the if a user is admin in one server, then he has admin in every other server.</p>
              <p>- many other fixes...</p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
};

export default PatchNotes;