import React, { useContext, useState } from 'react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react';
import axios from "axios"

// components
import { Context } from '../../Context/Context';

// styles
import "./EditChannelModal.css"

const EditChannelModal = ({ isOpen, onClose, id, name, channelType, removeChannelLocally }) => {
  const { currentVoiceChannelId, setCurrentVoiceChannelId } = useContext(Context)
  const [channelName,setChannelName] = useState(name)
  const [askDelete,setAskDelete] = useState(false)

  const handleDelete = async () => {
    try {
      if(!askDelete) return setAskDelete(true)
      if(channelType === "text"){
        removeChannelLocally("text", id)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/removeTextChannel`, {
          id
        }, {
          withCredentials: true
        })
      }
      else if(channelType === "voice") {
        if(currentVoiceChannelId === id){
          setCurrentVoiceChannelId("")
        }
        removeChannelLocally("voice", id)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/removeVoiceChannel`, {
          id
        }, {
          withCredentials: true
        })
      }
      closeModal()
    }
    catch(error){
      console.log(error)
    }
  }

  const renameChannel = async () => {
    closeModal()
    if(!channelName || channelName === name || channelName.length > 15) return
    try {
      if(channelType === "text"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/renameTextChannel`, {
          id,
          name: channelName
        }, {
          withCredentials: true
        })
      }
      else if(channelType === "voice"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/renameVoiceChannel`, {
          id,
          name: channelName
        }, {
          withCredentials: true
        })
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const closeModal = () => {
    setChannelName(name)
    setAskDelete(false)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay bgColor="blackAlpha.800" />
      <ModalContent bgColor="#313338">
        <ModalHeader>
          <p id='edit-channel-modal-header'>Edit Channel</p>
        </ModalHeader>
        <ModalBody>
          <div id='edit-channel-body'>
            <div>
              <p className='edit-channel-text'>CHANNEL NAME</p>
              <input id='edit-channel-input' value={channelName} onChange={e => setChannelName(e.target.value)} />
            </div>
            <div>
              <p className='edit-channel-text'>DELETE THIS CHANNEL</p>
              <button id='edit-channel-delete-button' onClick={handleDelete}>
                {askDelete ? "Are you sure?" : "Delete Channel"}
              </button>
            </div>
          </div>
        </ModalBody>
        <ModalFooter bgColor="#2b2d31" borderBottomRadius={3}>
          <button id='edit-channe-modal-done' onClick={renameChannel}>Done</button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditChannelModal;