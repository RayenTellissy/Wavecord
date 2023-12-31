import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import useSound from 'use-sound'
import { HiSpeakerWave } from "react-icons/hi2"
import { useDisclosure, Tooltip } from '@chakra-ui/react';
import { IoIosSettings } from "react-icons/io"

// components
import { Context } from '../../Context/Context';
import UserInRoom from './UserInRoom/UserInRoom';
import EditChannelModal from '../EditChannelModal/EditChannelModal';

// styles
import "./VoiceChannel.css"

// sounds
import JoinRoom from "../../../assets/sounds/JoinRoom.mp3"

const VoiceChannel = ({
  id,
  name,
  hoveredVoiceChannelId,
  setHoveredVoiceChannelId,
  isAdmin,
  removeChannelLocally,
  renameChannelLocally
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, socket, currentVoiceChannelId, setCurrentVoiceChannelId, displayRoom, setDisplayRoom } = useContext(Context)
  const [users,setUsers] = useState([])
  const [playJoin] = useSound(JoinRoom, { volume: 0.2 })
  

  useEffect(() => {
    fetchUsersInRoom()
  },[])
  
  useEffect(() => {
    socket.on("receive_voice_update", data => {
      if(data.channelId === id){
        if(data.users.length){
          setUsers(data.users)
        }
      }
    })
    socket.on("receive_leave_voice", () => {
      fetchUsersInRoom()
    })
    return () => {
      socket.off("receive_leave_voice")
      socket.off("receive_voice_update")
    }
  },[socket])

  useEffect(() => {
    if(!currentVoiceChannelId){
      setDisplayRoom(false)
    }
    // locally remove the user from this voice channel when he leaves
    if(currentVoiceChannelId !== id){
      setUsers(users.filter(e => e.id !== user.id))
      setHoveredVoiceChannelId("")
    }
  }, [currentVoiceChannelId])

  const fetchUsersInRoom = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchUsersInRoom/${id}`, {
        withCredentials: true
      })
      setUsers(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleClick = async () => {
    // if user clicks on the room he's connected to, display video conference
    if(currentVoiceChannelId === id){
      return setDisplayRoom(!displayRoom)
    }
    // if user is not connected to any other rooms connect him.
    if(!currentVoiceChannelId){
      playJoin()
      const userDetails = {
        id: user.id,
        username: user.username,
        image: user.image,
        channelId: id
      }
      if(users){
        setUsers(prevUsers => [...prevUsers, userDetails])
      }
      setCurrentVoiceChannelId(id)
    }
  }

  const handleActive = (boolean) => {
    if(currentVoiceChannelId === id) return
    if(boolean){
      return setHoveredVoiceChannelId(id)
    }
    setHoveredVoiceChannelId("")
  }

  const openModal = (e) => {
    e.stopPropagation()
    onOpen()
  }

  return (
    <div id='server-voice-channel-button'
      onClick={handleClick} 
      onMouseEnter={() => handleActive(true)}
      onMouseLeave={() => handleActive(false)}
    >
      <div id='server-voice-channel-title-container'>
        <div id='server-voice-channel-title-info'>
          <HiSpeakerWave id='server-voice-channel-speaker'/>
          <p id={currentVoiceChannelId === id || hoveredVoiceChannelId === id
            ? 'server-voice-channel-name-active'
            : 'server-voice-channel-name'}
          >
            { name }
          </p>
          {currentVoiceChannelId === id && <p id='server-voice-channel-click-display'>
            {displayRoom ? "(click to display text channel)" : "(click to display room)"}
          </p>}
        </div>
        {isAdmin && (
          <>
          {(currentVoiceChannelId === id || hoveredVoiceChannelId === id) && (
            <Tooltip
              label="Edit Channel"
              placement='top'
              color="white"
              backgroundColor="black"
              fontFamily="GibsonRegular"
              hasArrow={true}
              arrowSize={10}
              padding="7px 13px"
              borderRadius={7}
              >
              <button onClick={openModal}>
                <IoIosSettings size={18} color='#949ba4'/>
              </button>
            </Tooltip>
          )}
          <EditChannelModal
            channelType="voice"
            isOpen={isOpen}
            onClose={onClose}
            id={id}
            name={name}
            removeChannelLocally={removeChannelLocally}
            renameChannelLocally={renameChannelLocally}
          />
        </>
        )}
      </div>
      {users && users.map((e,i) => {
        return <UserInRoom
          key={i}
          id={e.id}
          username={e.username}
          image={e.image}
          userSpeaking={e.isSpeaking}
          userMicEnabled={e.isMicrophoneEnabled}
          userCameraEnabled={e.isCameraEnabled}
          userScreenShareEnabled={e.isScreenShareEnabled}
        />
      })}
    </div>
  );
};

export default VoiceChannel;