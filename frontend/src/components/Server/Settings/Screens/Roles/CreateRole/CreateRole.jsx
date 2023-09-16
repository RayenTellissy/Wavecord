import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalHeader, ModalFooter } from "@chakra-ui/react"
import { TwitterPicker } from "react-color"
import { RiShieldUserFill } from "react-icons/ri"
import axios from "axios"
import BeatLoader from 'react-spinners/BeatLoader';

// components
import Switch from "../../../../../common/Switch/Switch"

// styles
import "./CreateRole.css"

const CreateRole = ({ isOpen, onClose, serverId, fetchRoles, setQuery }) => {
  const [roleName, setRoleName] = useState("")
  const [roleColor, setRoleColor] = useState("#fff")
  const [checked, setChecked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!roleName || !roleColor) return
    try {
      setIsLoading(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/createRole`, {
        roleName: roleName,
        roleColor: roleColor,
        isAdmin: checked,
        serverId: serverId
      })
      onClose()
      setQuery("")
      setChecked(false)
      setIsLoading(false)
      await fetchRoles()
    }
    catch (error) {
      console.log(error)
    }
  }

  const handleColorChange = (color) => {
    setRoleColor(color.hex)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="#313338">
        <ModalHeader display="flex" justifyContent="center" fontFamily="GibsonMedium" fontSize={25}>
          <p>Create Role</p>
        </ModalHeader>
        <ModalBody display="flex" flexDirection="column" justifyContent="center">
          <input
            id='create-role-modal-input'
            placeholder='Role name'
            onChange={e => setRoleName(e.target.value)}
            autoComplete='off'
            autoFocus
          />
          <div id='create-role-modal-picker-title-container'>
            <div id='create-role-modal-picker-container'>
              <div id='create-role-modal-title-container'>
                <p id='create-role-modal-title'>Role color</p>
                <RiShieldUserFill color={roleColor} size={45} />
              </div>
              <TwitterPicker
                triangle='hide'
                color={roleColor}
                onChangeComplete={handleColorChange}
                styles={{ default: { card: { backgroundColor: 'transparent', boxShadow: "none" } } }}
              />
            </div>
            <div id='create-role-modal-switch-container'>
              <p id='create-role-modal-switch-title'>Admin Role</p>
              <Switch checked={checked} setChecked={setChecked} />
            </div>
          </div>
        </ModalBody>
        <ModalFooter display="flex" justifyContent="center">
          <button id='create-role-modal-create-button' onClick={handleSubmit}>
            {isLoading ? <BeatLoader size={8} color='white' /> : `Create Role`}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateRole;