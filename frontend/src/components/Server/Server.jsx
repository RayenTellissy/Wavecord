import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody
} from "@chakra-ui/react"
import { FaHashtag } from "react-icons/fa"
import { MdOutlineRadioButtonChecked, MdOutlineRadioButtonUnchecked } from "react-icons/md"
import { HiSpeakerWave } from "react-icons/hi2"
import { IoMdLock, IoIosArrowDown } from "react-icons/io"
import { MdClose } from "react-icons/md"
import BeatLoader from 'react-spinners/BeatLoader';
import useSound from 'use-sound';

// components
import Category from './Category/Category';
import Switch from '../common/Switch/Switch';
import ChannelMessages from './ChannelMessages/ChannelMessages';
import Userbar from "../Home/ContactsBar/UserBar/UserBar"
import AllButtons from './PopoverButtons/AllButtons';
import ServerLink from './ServerLinkModal/ServerLink';
import { Context } from '../Context/Context';
import VoiceRoom from './VoiceRoom/VoiceRoom';
import SimpleLoader from "../common/SimpleLoader/SimpleLoader"

// styles
import "./Server.css"

// helper functions
import { applyMemorization, memorizeTextChannel } from "../../utils/Helper/memorizeTextChannel"

// sounds
import JoinRoom from "../../assets/sounds/JoinRoom.mp3"
import LeaveRoom from "../../assets/sounds/LeaveRoom.mp3"

const Server = () => {
  const { 
    user,
    socket,
    displayRoom,
    setDisplayRoom,
    fetchServers,
    currentVoiceChannelId,
    currentServerId
  } = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenDropdown, onOpen: onOpenDropdown, onClose: onCloseDropdown } = useDisclosure()
  const { isOpen: isOpenServerLink, onOpen: onOpenServerLink, onClose: onCloseServerLink } = useDisclosure()
  const [server,setServer] = useState({})
  const [currentTextChannel,setCurrentTextChannel] = useState("")
  const [currentTextChannelId,setCurrentTextChannelId] = useState("")
  const [hoveredTextChannelId,setHoveredTextChannelId] = useState("")
  const [hoveredVoiceChannelId,setHoveredVoiceChannelId] = useState("")
  const [categoryChosen,setCategoryChosen] = useState("")
  const [categoryIdChosen,setCategoryIdChosen] = useState("")
  const [modalChannelType,setModalChannelType] = useState("text")
  const [modalChannelName,setModalChannelName] = useState("")
  const [privateChecked,setPrivateChecked] = useState(false)
  const [createDisabled,setCreateDisabled] = useState(true)
  const [showDropdown,setShowDropdown] = useState(false)
  const [isLoading,setisLoading] = useState(false)
  const [role,setRole] = useState({})
  const [playJoin] = useSound(JoinRoom, { volume: 0.2 })
  const [playLeave] = useSound(LeaveRoom, { volume: 0.1 })

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => handleUnload(e))
    socket.emit("open_server", currentServerId)
    fetchServers()
    applyMemorization(currentServerId, setCurrentTextChannelId, setCurrentTextChannel) // text channel memo
    fetchData()
    return () => {
      setDisplayRoom(false)
      window.removeEventListener("beforeunload", handleUnload)
    }
  },[currentServerId])

  useEffect(() => {
    handleDefaultChannel()
  },[server])

  useEffect(() => {
    if(!currentVoiceChannelId){
      Cookies.remove("cachedVoiceChannel")
    }
    else {
      Cookies.set("cachedVoiceChannel", currentVoiceChannelId)
    }
  },[currentVoiceChannelId])

  useEffect(() => {
    memorizeTextChannel(currentServerId,currentTextChannelId,currentTextChannel)
  },[currentTextChannelId])
  
  const fetchData = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/fetch`,{
        serverId: currentServerId,
        userId: user.id
      }, {
        withCredentials: true
      })
      setServer(response.data.server)
      setRole(response.data.role)
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
      setisLoading(true)
      if(modalChannelType === "text"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/createTextChannel`,{
          name: modalChannelName,
          categoryId: categoryIdChosen,
          serverId: currentServerId
        }, {
          withCredentials: true
        })
      }
      else if(modalChannelType === "voice"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/createVoiceChannel`,{
          name: modalChannelName,
          categoryId: categoryIdChosen,
          serverId: currentServerId
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
      setModalChannelType("text")
      setModalChannelName("")
    }
    catch(error){
      console.log(error)
    }
  }

  const handlePopoverOpen = () => {
    setShowDropdown(true)
    onOpenDropdown()
  }

  const handlePopoverClose = () => {
    setShowDropdown(false)
    onCloseDropdown()
  }

  const closeModal = () => {
    setPrivateChecked(false)
    onClose()
  }

  // leaves voice room before unloading app
  const handleUnload = () => {
    const cachedVoiceChannel = Cookies.get("cachedVoiceChannel")
    if(cachedVoiceChannel){
      socket.emit("leave_voice", {
        serverId: currentServerId,
        channelId: cachedVoiceChannel,
        userId: user.id
      })
      fetch(`${import.meta.env.VITE_SERVER_URL}/servers/leaveVoiceRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user.id
        }),
        keepalive: true,
        credentials: "include"
      })
    }
  }

  const handleDefaultChannel = () => {
    if(!currentTextChannelId && server.categories && server.categories[0].Text_channels){
      const channel = server.categories[0].Text_channels[0]
      setCurrentTextChannelId(channel.id)
      setCurrentTextChannel(channel.name)
    }
  }

  return (
    <div id='server-container'>
      <button id='voice-channel-join-sound-activator' onClick={() => playJoin()}/>
      <button id='voice-channel-leave-sound-activator' onClick={() => playLeave()}/>
      <div id='server-bar-container'>
        <div id='server-bar-main'>
          <Popover
            placement='bottom'
            isOpen={isOpenDropdown}
            onOpen={handlePopoverOpen}
            onClose={handlePopoverClose}
          >
            <PopoverTrigger>
              <button id='server-name-container'>
                <div id='server-popover-name-icon'>
                  <p id='server-name'>{server.name}</p>
                  <div id='server-banner-icon-container'>
                    {showDropdown
                    ? <MdClose size={25}/>
                    : <IoIosArrowDown size={25}/>}
                  </div>
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent bgColor="#111214" width={280}>
              <PopoverBody>
                <AllButtons
                  ownerId={server.ownerId}
                  onOpen={onOpenServerLink}
                  user={user}
                  server={server}
                  fetchData={fetchData}
                  isAdmin={role ? role.isAdmin : false}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <div id='server-category-main-container'>
            {!server.categories && <SimpleLoader />}
            {server.categories && server.categories.map((e,i) => {
              return <Category
                key={i}
                isAdmin={role ? role.isAdmin : false}
                ownerId={server.ownerId}
                user={user}
                id={e.id}
                name={e.name}
                text={e.Text_channels}
                voice={e.Voice_channels}
                onOpen={onOpen}
                serverId={currentServerId}
                setCategoryChosen={setCategoryChosen}
                setCategoryIdChosen={setCategoryIdChosen}
                setCurrentTextChannel={setCurrentTextChannel}
                currentTextChannelId={currentTextChannelId}
                setCurrentTextChannelId={setCurrentTextChannelId}
                hoveredTextChannelId={hoveredTextChannelId}
                setHoveredTextChannelId={setHoveredTextChannelId}
                hoveredVoiceChannelId={hoveredVoiceChannelId}
                setHoveredVoiceChannelId={setHoveredVoiceChannelId}
              />
            })}
          </div>
          <Userbar/>
        </div>
      </div>
      <div id='server-right-display-content'>
        {!displayRoom && <ChannelMessages
          serverId={currentServerId}
          currentTextChannel={currentTextChannel}
          setCurrentTextChannel={setCurrentTextChannel}
          currentTextChannelId={currentTextChannelId}
          setCurrentTextChannelId={setCurrentTextChannelId}
          roleColor={role ? role.color : "white"}
          server={server}
        />}
        {currentVoiceChannelId && <VoiceRoom
          serverId={server.id}
          channelId={currentVoiceChannelId}
        />}
      </div>
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
                {isLoading ? <BeatLoader size={9} color='white'/> : "Create Channel"}
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <ServerLink
        isOpen={isOpenServerLink}
        onOpen={onOpenServerLink}
        onClose={onCloseServerLink}
        server={server}
        user={user}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Server;