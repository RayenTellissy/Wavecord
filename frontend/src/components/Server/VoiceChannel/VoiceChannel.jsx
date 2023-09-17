import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { HiSpeakerWave } from "react-icons/hi2"

// components
import { Context } from '../../Context/Context';
import UserInRoom from './UserInRoom/UserInRoom';

// styles
import "./VoiceChannel.css"

const VoiceChannel = ({
  id,
  name,
  setCurrentChannelType,
  currentVoiceChannelId,
  setCurrentVoiceChannelId,
  hoveredVoiceChannelId,
  setHoveredVoiceChannelId
}) => {
  const { user, socket } = useContext(Context)
  const [users,setUsers] = useState([])

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
    socket.on("receive_leave_voice", data => {
      if(data.channelId === id){
        fetchUsersInRoom()
      }
    })
    return () => {
      socket.off("receive_leave_voice")
      socket.off("receive_voice_update")
    }
  },[socket])

  useEffect(() => {
    // locally remove the user from this voice channel when he leaves
    if(!currentVoiceChannelId){
      setUsers(users.filter(e => e.id !== user.id))
      setHoveredVoiceChannelId("")
    }
  },[currentVoiceChannelId])

  const fetchUsersInRoom = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchUsersInRoom/${id}`)
      setUsers(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const handleClick = async () => {
    // checking if user is already connected to the room
    if(currentVoiceChannelId !== id){
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
      setCurrentChannelType("voice")
    }
  }

  const handleActive = (boolean) => {
    if(currentVoiceChannelId === id) return
    if(boolean){
      return setHoveredVoiceChannelId(id)
    }
    setHoveredVoiceChannelId("")
  }

  currentVoiceChannelId === id

  return (
    <button id='server-voice-channel-button'
      onClick={handleClick} 
      onMouseEnter={() => handleActive(true)}
      onMouseLeave={() => handleActive(false)}
    >
      <div id='server-voice-channel-title-container'>
        <HiSpeakerWave id='server-voice-channel-speaker'/>
        <p id={currentVoiceChannelId === id || hoveredVoiceChannelId === id
          ? 'server-voice-channel-name-active'
          : 'server-voice-channel-name'}
        >
          { name }
        </p>
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
    </button>
  );
};

export default VoiceChannel;