import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter
} from '@chakra-ui/react'
import { FaHashtag } from "react-icons/fa"
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md"
import { HiSpeakerWave } from "react-icons/hi2"
import { IoMdLock } from "react-icons/io"
import { RiArrowDropDownLine } from "react-icons/ri"
import { MdClose } from "react-icons/md"

// components
import Sidebar from '../Home/Sidebar/Sidebar';
import Category from './Category/Category';
import Switch from '../common/Switch/Switch';
import ChannelMessages from './ChannelMessages/ChannelMessages';
import Userbar from "../Home/ContactsBar/UserBar/UserBar"

// styles
import "./Server.css"

const Server = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = useParams()
  const [server,setServer] = useState({})
  const [currentTextChannel,setCurrentTextChannel] = useState("")
  const [currentTextChannelId,setCurrentTextChannelId] = useState("")
  const [categoryChosen,setCategoryChosen] = useState("")
  const [categoryIdChosen,setCategoryIdChosen] = useState("")
  const [modalChannelType,setModalChannelType] = useState("text")
  const [modalChannelName,setModalChannelName] = useState("")
  const [privateChecked,setPrivateChecked] = useState(false)
  const [createDisabled,setCreateDisabled] = useState(true)
  const [showDropdown,setShowDropdown] = useState(false)
  
  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${id}`)
      setServer(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleNameChange = (e) => {
    setModalChannelName(e.target.value)
    if(modalChannelName !== 0){
      setCreateDisabled(false)
    }
  }

  const createChannel = async () => {
    if(createDisabled) return
    setCreateDisabled(true) // disabling the submit button (anti-spam)
    try {
      if(modalChannelType === "text"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/createTextChannel`,{
          name: modalChannelName,
          categoryId: categoryIdChosen,
          serverId: id
        })
      }
      else if(modalChannelType === "voice"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/createVoiceChannel`,{
          name: modalChannelName,
          categoryId: categoryIdChosen,
          serverId: id
        })
      }
      fetchData() // refreshing data
      onClose() // closing modal
      // resetting states after submitting
      setCategoryChosen("")
      setCategoryIdChosen("")
      setModalChannelType("text")
      setModalChannelName("")
    }
    catch(error){
      console.log(error)
    }
  }
  
  return (
    <div id='server-container'>
      <Sidebar highlighted={server.id}/>
      <div id='server-bar-container'>
        <div id='server-bar-main'>
          <div id='server-name-container' onClick={() => setShowDropdown(!showDropdown)}>
            <p id='server-name'>{server.name}</p>
            <div id='server-banner-icon-container'>
              {showDropdown ? <MdClose size={22}/> : <RiArrowDropDownLine size={40}/>}
            </div>
          </div>
          <div id='server-category-main-container'>
            {server.categories && server.categories.map((e,i) => {
              return <Category
                key={i}
                id={e.id}
                name={e.name}
                text={e.Text_channels}
                voice={e.Voice_channels}
                onOpen={onOpen}
                setCategoryChosen={setCategoryChosen}
                setCategoryIdChosen={setCategoryIdChosen}
                setCurrentTextChannel={setCurrentTextChannel}
                setCurrentTextChannelId={setCurrentTextChannelId}
              />
            })}
            <Userbar/>
          </div>
        </div>
      </div>
      <div id='server-right-display-content'>
        <ChannelMessages
          serverId={id}
          currentTextChannel={currentTextChannel}
          currentTextChannelId={currentTextChannelId}
        />
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay/>
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
                id={modalChannelType === "text" ? 'server-category-modal-body-text-type-active' : 'server-category-modal-body-text-type-inactive'}
                onClick={() => setModalChannelType("text")}
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
                    {modalChannelType === "text" ? <MdOutlineRadioButtonChecked size={30}/> : <MdOutlineRadioButtonUnchecked size={30}/>}
                  </div>
                </div>
              </button>
              <button 
                className='server-category-modal-body-type'
                id={modalChannelType === "voice" ? 'server-category-modal-body-voice-type-active' : 'server-category-modal-body-voice-type-inactive'}
                onClick={() => setModalChannelType("voice")}
              >
                <div className='server-category-modal-body-type-container'>
                  <HiSpeakerWave className='server-category-modal-body-type-icon' size={28} color='#b3b4b7'/>
                  <div className='server-category-modal-body-type-details'>
                    <p className='server-category-modal-body-type-title'>Voice</p>
                    <p className='server-category-modal-body-type-description'>Hang out together with voice, video, and screen share</p>
                  </div>
                  <div className='server-category-modal-body-radio-container'>
                    {modalChannelType === "voice" ? <MdOutlineRadioButtonChecked size={30}/> : <MdOutlineRadioButtonUnchecked size={30}/>}
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
                  {modalChannelType === "text" ? <FaHashtag className='server-category-modal-body-channel-name-input-icon'/> : <HiSpeakerWave className='server-category-modal-body-channel-name-input-icon'/>}
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
              <button id='server-category-modal-body-private-cancel-button' onClick={onClose}>
                Cancel
              </button>
              <button 
                className='server-category-modal-body-private-create-button'
                id={modalChannelName !== "" && modalChannelName.length < 15 ? 'server-category-modal-body-private-create-button-active' : 'server-category-modal-body-private-create-button-inactive'}
                onClick={createChannel}
              >
                Create Channel
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Server;