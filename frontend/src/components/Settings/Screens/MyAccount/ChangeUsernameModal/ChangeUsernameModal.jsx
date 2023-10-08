import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter } from "@chakra-ui/react"
import BeatLoader from "react-spinners/BeatLoader"
import axios from 'axios';

// styles
import "./ChangeUsernameModal.css"

const ChangeUsernameModal = ({ user, setUser, isOpen, onClose }) => {
  const [isLoading,setIsLoading] = useState(false)
  const [newUsername,setNewUsername] = useState(user.username)
  const [password,setPassword] = useState("")
  const [wrongPassword,setWrongPassword] = useState(false)
  
  const changeUsername = async () => {
    if(!newUsername || user.username === newUsername) return
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/changeUsername`, {
        id: user.id,
        email: user.email,
        newUsername,
        password
      })
      setIsLoading(false)
      
      // if the password given is wrong show a text saying "wrong password"
      if(response.data.code === "INCPWD") {
        return setWrongPassword(true)
      }
      // if operation is successful update user state and close modal
      setUser(prevUser => ({ ...prevUser, username: newUsername }))
      clearFieldsAndClose()
    }
    catch(error){
      console.log(error)
    }
  }

  const clearFieldsAndClose = () => {
    setNewUsername(user.username)
    setPassword("")
    setWrongPassword(false)
    setIsLoading(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={clearFieldsAndClose} isCentered>
      <ModalOverlay bgColor="blackAlpha.800"/>
      <ModalContent borderRadius={3} bg="#313338" maxW={430}>
        <ModalBody padding="15px">
          <div id='change-username-title-container'>
            <p id='change-username-title'>Change your username</p>
            <p id='change-username-under-title'>Enter a new username and your existing password.</p>
          </div>
          <div id='change-username-input-container'>
            <div>
              <p className='change-username-input-title'>USERNAME</p>
              <input
                className='change-username-input'
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
              />
            </div>
            <div>
              <p className='change-username-input-title'>CURRENT PASSWORD</p>
              <input
                type='password'
                className='change-username-input'
                onChange={e => setPassword(e.target.value)}
              />
              {wrongPassword && <p id='change-username-wrong-password'>WRONG PASSWORD</p>}
            </div>
          </div>
        </ModalBody>
        <ModalFooter borderBottomRadius={3} h={16} bgColor="#2a2c31">
          <div id='change-username-footer'>
            <button id='change-username-cancel-button' onClick={clearFieldsAndClose}>Cancel</button>
            <button
              id={(newUsername && password) ? 'change-username-done-button': "change-username-done-button-disabled"}
              onClick={changeUsername}
            >
              {isLoading ? <BeatLoader color='white' size={8}/> : "Done"}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeUsernameModal;