import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi"
import { MdHeadset, MdHeadsetOff } from "react-icons/md"
import { IoIosSettings } from "react-icons/io"
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure, Tooltip } from '@chakra-ui/react';
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt2Bar, MdOutlineSignalCellularAlt1Bar } from "react-icons/md"
import { HiPhoneMissedCall } from "react-icons/hi"

// components
import Avatar from "../../../common/Avatar/Avatar"
import { Context } from '../../../Context/Context';
import ToolButton from './ToolButton/ToolButton';

// styles
import "./UserBar.css"

const UserBar = () => {
  const {
    user,
    micEnabled,
    setMicEnabled,
    cameraEnabled,
    setCameraEnabled,
    selectScreenShare,
    setSelectScreenShare,
    connectionQuality,
    displayRoom,
    setDisplayRoom,
    status,
    setStatus,
    currentVoiceChannelId,
    setCurrentVoiceChannelId
  } = useContext(Context)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [statusHovered,setStatusHovered] = useState("")

  const disconnect = () => {
    setCurrentVoiceChannelId("")
  }

  const handleCustomStatus = (chosenStatus) => {
    if(chosenStatus === status) return
    if(chosenStatus === "ONLINE"){
      localStorage.removeItem("customStatus")
    }
    if(chosenStatus !== "ONLINE"){
      localStorage.setItem("customStatus", chosenStatus)
    }
    setStatus(chosenStatus)
    onClose()
  }

  return (
    <div id='home-contacts-userbar-container'>

      {currentVoiceChannelId && <div id='home-contacts-userbar-voice-tools-container'>
        <div id='home-contacts-userbar-voice-status'>
          {connectionQuality === "excellent"
          ? <MdOutlineSignalCellularAlt size={30} color='#2cc164'/>
          : ((connectionQuality === "good")
          ? <MdOutlineSignalCellularAlt2Bar size={30} color='#f0b132'/>
          : (connectionQuality === "poor" ? <MdOutlineSignalCellularAlt1Bar size={30} color='#da373c'/> : null))}
          <p style={connectionQuality === "excellent"
          ? { color: '#2cc164'}
          : ((connectionQuality === "good" || !connectionQuality || connectionQuality === "unknown")
          ? { color: '#f0b132' }
          : { color: '#da373c' })}>
            {!connectionQuality
            ? "Awaiting Response"
            : (connectionQuality === "unknown" ? "Connecting" : "Voice Connected" )}
          </p>
          <Tooltip
            label="Disconnect"
            placement="top"
            color="#dbdee1"
            backgroundColor="black"
            fontFamily="GibsonMedium"
            hasArrow={true}
            arrowSize={10}
            padding={2.5}
            borderRadius={7}
          >
            <button id='userbar-disconnect-button' onClick={disconnect}>
              <HiPhoneMissedCall color='#b3b8bf' size={25}/>
            </button>
          </Tooltip>
        </div>
        <div id='home-contacts-userbar-voice-tools-buttons'>
          <ToolButton tool="Camera" callback={() => setCameraEnabled(!cameraEnabled)}/>
          <ToolButton tool="Share Screen" callback={() => setSelectScreenShare(!selectScreenShare)}/>
        </div>
      </div>}

      <div id='home-contacts-userbar-bottom-container'>
        <Popover isOpen={isOpen} onClose={onClose} placement='top-start'>
          <div id='home-contacts-userbar-avatar-section'>
            <PopoverTrigger>
              <button className='home-contacts-userbar-popover-button' onClick={onOpen}>
                <Avatar image={user.image} status={status}/>
                <div id='home-contacts-userbar-avatar-name-status'>
                  <p id='home-contacts-userbar-username'>{user.username}</p>
                  <p id='home-contacts-userbar-status'>
                  {status === "ONLINE" ? "Online" : (status === "BUSY" ? "Busy" : "Invisible")}
                  </p>
                </div>
              </button>
            </PopoverTrigger>
          </div>
          <PopoverContent bgColor="#111214" border="none" w={300}>
            <PopoverBody padding="10px 10px">
              <div id='home-contacts-userbar-status-buttons-container'>
                <button className='home-contacts-userbar-status-button'
                  onMouseEnter={() => setStatusHovered("online")}
                  onMouseLeave={() => setStatusHovered("")}
                  onClick={() => handleCustomStatus("ONLINE")}
                >
                  <div id={statusHovered === "online" ? 'user-bar-hovered-status' : 'user-bar-online-circle'}/>
                  Online
                </button>
                <button className='home-contacts-userbar-status-button'
                  onMouseEnter={() => setStatusHovered("busy")}
                  onMouseLeave={() => setStatusHovered("")}
                  onClick={() => handleCustomStatus("BUSY")}
                >
                  <div id={statusHovered === "busy" ? 'user-bar-hovered-status' : 'user-bar-busy-circle'}/>
                  Busy
                </button>
                <button className='home-contacts-userbar-status-button'
                  onMouseEnter={() => setStatusHovered("invisible")}
                  onMouseLeave={() => setStatusHovered("")}
                  onClick={() => handleCustomStatus("OFFLINE")}
                >
                  <div id={statusHovered === "invisible" ? 'user-bar-hovered-status' : 'user-bar-invisible-circle'}/>
                  Invisible
                </button>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <div id='home-contacts-userbar-icons-section'>
          <button onClick={() => setMicEnabled(!micEnabled)}>
            {micEnabled
            ? <BiSolidMicrophone className='home-contacts-userbar-icon'/>
            : <BiSolidMicrophoneOff className='home-contacts-userbar-icon'/>}
          </button>
          <button onClick={() => setDisplayRoom(!displayRoom)}>
            <MdHeadset className='home-contacts-userbar-icon'/>
          </button>
          <button onClick={() => navigate("/settings")}>
            <IoIosSettings className='home-contacts-userbar-icon'/>
          </button>
        </div>
      </div>
        
    </div>
  );
};

export default UserBar;