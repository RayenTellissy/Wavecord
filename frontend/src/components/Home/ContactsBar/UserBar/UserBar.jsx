import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BiSolidMicrophone, BiSolidMicrophoneOff } from "react-icons/bi"
import { MdHeadset, MdHeadsetOff } from "react-icons/md"
import { IoIosSettings } from "react-icons/io"
import { Popover, PopoverTrigger, PopoverContent, PopoverBody, useDisclosure } from '@chakra-ui/react';

// components
import Avatar from "../../../common/Avatar/Avatar"
import { Context } from '../../../Context/Context';

// styles
import "./UserBar.css"

const UserBar = () => {
  const {
    user,
    micEnabled,
    setMicEnabled,
    displayRoom,
    setDisplayRoom,
    status,
    setStatus,
    setCurrentVoiceChannelId,
    socket
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
      localStorage.setItem("customStatus", status)
    }
    setStatus(chosenStatus)
    onClose()
  }

  return (
    <div id='home-contacts-userbar-container'>

      <Popover isOpen={isOpen} onClose={onClose}>
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
        <PopoverContent bgColor="#111214" border="none">
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
  );
};

export default UserBar;