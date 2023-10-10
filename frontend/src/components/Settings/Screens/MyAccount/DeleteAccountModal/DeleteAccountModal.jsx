import React, { useContext, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"
import axios from 'axios';
import Cookies from 'js-cookie';

// components
import { Context } from '../../../../Context/Context';

// styles
import "./DeleteAccountModal.css"

const DeleteAccountModal = ({ id, isOpen, onClose, onOpen, ownsOnOpen }) => {
  const { user, setUser } = useContext(Context)
  const [password,setPassword] = useState("")
  const [wrongPassword,setWrongPassword] = useState(false)

  const handleSubmit = async () => {
    if(!password) return
    onClose()
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/removeAccount`, {
        id,
        email: user.email,
        password
      }, {
        withCredentials: true
      })
      
      // if password is wrong re open the modal with a wrong password text
      if(response.data.code === "INCPWD"){
        setWrongPassword(true)
        return onOpen()
      }
      // closing modal
      clearFieldsAndClose()

      // if user currently owns servers, return an error modal
      if(response.data.code === "OS"){
        return ownsOnOpen()
      }
      
      // remove local user after account removal
      cleanUp()
    }
    catch(error){
      console.log(error)
    }
  }

  const cleanUp = async () => {
    try {
      // removing httpOnly cookies made for auth
      await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`, {
        withCredentials: true
      })
      // removing locally stored variables
      localStorage.clear()
      Cookies.remove()
      setUser({ loggedIn: false })
    }
    catch(error){
      console.log(error)
    }
  }

  const clearFieldsAndClose = () => {
    onClose()
    setPassword("")
    setWrongPassword(false)
  }

  return (
    <Modal isOpen={isOpen} onClose={clearFieldsAndClose} isCentered>
      <ModalOverlay bgColor={"blackAlpha.800"}/>
      <ModalContent borderTopRadius={3} bgColor={"#313338"}>
        <ModalHeader>
          <div id='delete-account-header'>
            Delete your account?
          </div>
        </ModalHeader>
        <ModalBody>
          <div id='delete-account-body-container'>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
          </div>
          <p id='delete-account-password-title'>CURRENT PASSWORD</p>
          <input id='delete-account-password-input' type='password' onChange={e => setPassword(e.target.value)} />
          {wrongPassword && <p id='delete-account-wrong-password'>WRONG PASSWORD</p>}
        </ModalBody>
        <ModalFooter borderBottomRadius={3} h={16} bgColor={"#2a2c31"}>
          <button id='delete-account-cancel-button' onClick={clearFieldsAndClose}>Cancel</button>
          <button id='delete-account-submit-button' onClick={handleSubmit}>Delete Account</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAccountModal;