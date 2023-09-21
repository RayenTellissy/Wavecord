import React, { useContext } from 'react';
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
    setCurrentVoiceChannelId
  } = useContext(Context)
  const navigate = useNavigate()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const disconnect = () => {
    setCurrentVoiceChannelId("")
  }

  return (
    <div id='home-contacts-userbar-container'>

      <Popover>
        <div id='home-contacts-userbar-avatar-section'>
            <button id='home-contacts-userbar-popover-button'>
          <PopoverTrigger>
            <>
              <Avatar image={user.image} status={status}/>
              <div id='home-contacts-userbar-avatar-name-status'>
                <p id='home-contacts-userbar-username'>{user.username}</p>
                <p id='home-contacts-userbar-status'>
                  {status === "ONLINE" ? "Online" : (status === "BUSY" ? "Busy" : "Invisible")}
                </p>
              </div>
            </>
          </PopoverTrigger>
            </button>
        </div>
        <PopoverContent>
          <PopoverBody>
            
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