import React, { useState } from 'react';
import { Modal, ModalCloseButton, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"
import { FaHashtag } from "react-icons/fa"
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md"
import { HiSpeakerWave } from "react-icons/hi2"
import { IoMdLock } from "react-icons/io"
import BeatLoader from 'react-spinners/BeatLoader';
import axios from 'axios';

// components
import Switch from "../../common/Switch/Switch"


const CreateChannel = ({
  isOpen,
  onClose,
  categoryIdChosen,
  setCategoryIdChosen,
  categoryChosen,
  setCategoryChosen,
  fetchData,
  currentServerId
}) => {
  const [privateChecked,setPrivateChecked] = useState(false)
  const [channelType,setChannelType] = useState("text")
  const [channelName,setChannelName] = useState("")
  const [createDisabled,setCreateDisabled] = useState(false)
  const [isLoading,setisLoading] = useState(false)
  
  const handleNameChange = (e) => {
    setChannelName(e.target.value)
    if(channelName !== 0){
      setCreateDisabled(false)
    }
  }

  const createChannel = async () => {
    if(createDisabled) return
    setCreateDisabled(true) // disabling the submit button (anti-spam)
    try {
      setisLoading(true)
      if(channelType === "text"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/createTextChannel`,{
          name: channelName,
          categoryId: categoryIdChosen,
          serverId: currentServerId,
          isPrivate: privateChecked
        }, {
          withCredentials: true
        })
      }
      else if(channelType === "voice"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/createVoiceChannel`,{
          name: channelName,
          categoryId: categoryIdChosen,
          serverId: currentServerId,
          isPrivate: privateChecked
        }, {
          withCredentials: true
        })
      }
      await fetchData() // refreshing data
      onClose() // closing modal
      setisLoading(false)
      // resetting states after submitting
      setCategoryChosen("")
      setCategoryIdChosen("")
      setChannelType("text")
      setChannelName("")
      setPrivateChecked(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const closeModal = () => {
    setPrivateChecked(false)
    onClose()
  }
  
  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered size="lg">
        <ModalOverlay bgColor="blackAlpha.800"/>
        <ModalContent  borderRadius={10} bg="#313338">
          <ModalHeader>
            <p id='server-category-modal-header-1'>Create Channel</p>
            <p id='server-category-modal-header-2'>in {categoryChosen}</p>
          </ModalHeader>
          <ModalCloseButton size="lg" color="#72767c"/>
          <ModalBody>
            <div id='server-category-modal-body-container'>
              <p id='server-category-modal-body-channel-type'>CHANNEL TYPE</p>
              <button 
                className='server-category-modal-body-type' 
                id={channelType === "text" ? 'server-category-modal-body-text-type-active' : 'server-category-modal-body-text-type-inactive'}
                onClick={() => setChannelType("text")}
              >
                <div className='server-category-modal-body-type-container'>
                  <FaHashtag className='server-category-modal-body-type-icon' size={28} color='#b3b4b7'/>
                  <div className='server-category-modal-body-type-details'>
                    <p className='server-category-modal-body-type-title'>Text</p>
                    <p className='server-category-modal-body-type-description'>
                      Send messages, images, GIFs, emoji, opinions, and puns
                    </p>
                  </div>
                  <div className='server-category-modal-body-radio-container'>
                    {channelType === "text" ? <MdOutlineRadioButtonChecked size={30}/> : <MdOutlineRadioButtonUnchecked size={30}/>}
                  </div>
                </div>
              </button>
              <button 
                className='server-category-modal-body-type'
                id={channelType === "voice" ? 'server-category-modal-body-voice-type-active' : 'server-category-modal-body-voice-type-inactive'}
                onClick={() => setChannelType("voice")}
              >
                <div className='server-category-modal-body-type-container'>
                  <HiSpeakerWave className='server-category-modal-body-type-icon' size={28} color='#b3b4b7'/>
                  <div className='server-category-modal-body-type-details'>
                    <p className='server-category-modal-body-type-title'>Voice</p>
                    <p className='server-category-modal-body-type-description'>Hang out together with voice, video, and screen share</p>
                  </div>
                  <div className='server-category-modal-body-radio-container'>
                    {channelType === "voice" ? <MdOutlineRadioButtonChecked size={30}/> : <MdOutlineRadioButtonUnchecked size={30}/>}
                  </div>
                </div>
              </button>
              <div>
                <p id='server-category-modal-body-channel-name'>CHANNEL NAME</p>
                <div id='server-category-modal-body-channel-input-container'>
                  <input 
                    id='server-category-modal-body-channel-name-input'
                    type='text' 
                    placeholder='new-channel'
                    onChange={e => handleNameChange(e)}
                    autoComplete='off'
                  />
                  {channelType === "text" ? <FaHashtag className='server-category-modal-body-channel-name-input-icon'/> : <HiSpeakerWave className='server-category-modal-body-channel-name-input-icon'/>}
                </div>
              </div>
              <div>
                <div id="server-category-modal-body-private-title-container">
                  <div id='server-category-modal-body-private-container'>
                    <IoMdLock id='server-category-modal-body-private-icon'/>
                    <p id='server-category-modal-body-private-text'>Private Channel</p>
                  </div>
                  <Switch checked={privateChecked} setChecked={setPrivateChecked}/>
                </div>
                <p id="server-category-modal-body-private-description">Only Selected members and roles will be able to view this channel.</p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter bg="#2b2d31" borderBottomRadius={10}>
            <div>
              <button id='server-category-modal-body-private-cancel-button' onClick={closeModal}>
                Cancel
              </button>
              <button 
                className='server-category-modal-body-private-create-button'
                id={channelName !== "" && channelName.length < 15 ? 'server-category-modal-body-private-create-button-active' : 'server-category-modal-body-private-create-button-inactive'}
                onClick={createChannel}
              >
                {isLoading ? <BeatLoader size={9} color='white'/> : "Create Channel"}
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
  );
};

export default CreateChannel;