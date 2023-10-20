import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi"
import { MdHeadset, MdHeadsetOff } from "react-icons/md"
import { IoIosSettings } from "react-icons/io"
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure, Tooltip } from '@chakra-ui/react';
import { MdOutlineSignalCellularAlt, MdOutlineSignalCellularAlt2Bar, MdOutlineSignalCellularAlt1Bar } from "react-icons/md"
import { HiPhoneMissedCall } from "react-icons/hi"
import useSound from 'use-sound';
import axios from 'axios';
import Cookies from "js-cookie"

// components
import Avatar from "../../../common/Avatar/Avatar"
import { Context } from '../../../Context/Context';
import ToolButton from './ToolButton/ToolButton';

// styles
import "./UserBar.css"

// sounds
import LeaveRoom from "../../../../assets/sounds/LeaveRoom.mp3"
import Mute from "../../../../assets/sounds/mute.mp3"
import Unmute from "../../../../assets/sounds/unmute.mp3"

// helper functions
import returnServerIds from '../../../../utils/Helper/returnServerId';

const UserBar = () => {
  const {
    user,
    socket,
    micEnabled,
    setMicEnabled,
    deafened,
    setDeafened,
    cameraEnabled,
    setCameraEnabled,
    selectScreenShare,
    setSelectScreenShare,
    screenShareEnabled,
    connectionQuality,
    status,
    setStatus,
    currentVoiceChannelId,
    setCurrentVoiceChannelId,
    servers
  } = useContext(Context)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [statusHovered,setStatusHovered] = useState("")
  const [playLeave] = useSound(LeaveRoom, { volume: 0.2 })
  const [playMute] = useSound(Mute, { volume: 0.2 })
  const [playUnmute] = useSound(Unmute, { volume: 0.2 })

  // use effect that handles muting and unmuting sound effects
  const changeMicActivity = (micEnabled) => {
    if(micEnabled){
      playMute()
      return setMicEnabled(false)
    }
    playUnmute()
    setMicEnabled(true)
  }

  const disconnect = () => {
    playLeave()
    setCurrentVoiceChannelId("")
  }

  const handleCustomStatus = async (chosenStatus) => {
    if(chosenStatus === status) return
    if(chosenStatus === "ONLINE"){
      localStorage.removeItem("customStatus")
    }
    if(chosenStatus !== "ONLINE"){
      localStorage.setItem("customStatus", chosenStatus)
    }
    setStatus(chosenStatus)
    onClose()
    await axios.put(`${import.meta.env.VITE_SERVER_URL}/users/setStatus`, {
      id: user.id,
      status: chosenStatus
    }, {
      withCredentials: true
    })
    if(Cookies.get("cachedFriends")){
      socket.emit("update_friend_status", {
        friends: JSON.parse(Cookies.get("cachedFriends")),
        userId: user.id
      })
    }
    socket.emit("server_member_status_changed", {
      serverRooms: returnServerIds(servers)
    })
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
          <ToolButton tool="Camera" cameraEnabled={cameraEnabled} callback={() => setCameraEnabled(!cameraEnabled)}/>
          <ToolButton
            tool="Share Screen"
            screenShareEnabled={screenShareEnabled}
            callback={() => setSelectScreenShare(!selectScreenShare)}
          />
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
          <Tooltip
            label={micEnabled ? "Mute" : "Unmute"}
            placement='top'
            color="white"
            backgroundColor="black"
            fontFamily="GibsonRegular"
            hasArrow={true}
            arrowSize={10}
            padding="7px 13px"
            borderRadius={7}
          >
            <button onClick={() => changeMicActivity(micEnabled)}>
              {micEnabled
              ? <BiSolidMicrophone className='home-contacts-userbar-icon'/>
              : <BiSolidMicrophoneOff className='home-contacts-userbar-icon'/>}
            </button>
          </Tooltip>
          <Tooltip
            label={"Deafen"}
            placement='top'
            color="white"
            backgroundColor="black"
            fontFamily="GibsonRegular"
            hasArrow={true}
            arrowSize={10}
            padding="7px 13px"
            borderRadius={7}
          >
            <button onClick={() => setDeafened(!deafened)}>
              {!deafened
                ? <MdHeadset className='home-contacts-userbar-icon'/>
                : <MdHeadsetOff className='home-contacts-userbar-icon'/>
              }
            </button>
          </Tooltip>
          <Tooltip
            label="User Settings"
            placement='top'
            color="white"
            backgroundColor="black"
            fontFamily="GibsonRegular"
            hasArrow={true}
            arrowSize={10}
            padding="7px 13px"
            borderRadius={7}
          >
            <button onClick={() => navigate("/settings")}>
              <IoIosSettings className='home-contacts-userbar-icon'/>
            </button>
          </Tooltip>
        </div>
      </div>
        
    </div>
  );
};

export default UserBar;