import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter } from "@chakra-ui/react"
import BeatLoader from "react-spinners/BeatLoader"
import axios from 'axios';

const ChangePasswordModal = ({ user, isOpen, onClose }) => {
  const [isLoading,setIsLoading] = useState(false)
  const [currentPassword,setCurrentPassword] = useState("")
  const [newPassword,setNewPassword] = useState("")
  const [confirmPassword,setConfirmPassword] = useState("")
  const [wrongPassword,setWrongPassword] = useState(false)
  
  const handleSubmit = async () => {
    if(!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) return
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/changePassword`, {
        id: user.id,
        email: user.email,
        password: currentPassword,
        newPassword
      }, {
        withCredentials: true
      })
      setIsLoading(false)

      if(response.data.code === "INCPWD"){
        return setWrongPassword(true)
      }

      clearFieldsAndClose()
    }
    catch(error){
      console.log(error)
    }
  }

  const clearFieldsAndClose = () => {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setIsLoading(false)
    setWrongPassword(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={clearFieldsAndClose} isCentered>
      <ModalOverlay bgColor="blackAlpha.800"/>
      <ModalContent borderRadius={3} bg="#313338" maxW={430}>
        <ModalBody padding="15px">
          <div id='change-username-title-container'>
            <p id='change-username-title'>Change your password</p>
            <p id='change-username-under-title'>Enter a your current password and a new password.</p>
          </div>
          <div id='change-username-input-container'>
            <div>
              <p className='change-username-input-title'>CURRENT PASSWORD</p>
              <input
                type='password'
                className='change-username-input'
                onChange={e => setCurrentPassword(e.target.value)}
              />
              {wrongPassword && <p id='change-username-wrong-password'>WRONG PASSWORD</p>}
            </div>
            <div>
              <p className='change-username-input-title'>NEW PASSWORD</p>
              <input
                type='password'
                className='change-username-input'
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <p className='change-username-input-title'>CONFIRM PASSWORD</p>
              <input
                type='password'
                className='change-username-input'
                onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter borderBottomRadius={3} h={16} bgColor="#2a2c31">
          <div id='change-username-footer'>
            <button id='change-username-cancel-button' onClick={clearFieldsAndClose}>Cancel</button>
            <button
              id={(currentPassword && newPassword && confirmPassword && newPassword === confirmPassword)
                ? 'change-username-done-button'
                : "change-username-done-button-disabled"}
              onClick={handleSubmit}
              disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            >
              {isLoading ? <BeatLoader color='white' size={8}/> : "Done"}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangePasswordModal;