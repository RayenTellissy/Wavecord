import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import useSound from 'use-sound'
import { HiSpeakerWave } from "react-icons/hi2"

// components
import { Context } from '../../Context/Context';
import UserInRoom from './UserInRoom/UserInRoom';

// styles
import "./VoiceChannel.css"

// sounds
import JoinRoom from "../../../assets/sounds/JoinRoom.mp3"

const VoiceChannel = ({
  id,
  name,
  hoveredVoiceChannelId,
  setHoveredVoiceChannelId
}) => {
  const { user, socket, currentVoiceChannelId, setCurrentVoiceChannelId, displayRoom, setDisplayRoom } = useContext(Context)
  const [users,setUsers] = useState([])
  const [play] = useSound(JoinRoom, { volume: 0.2 })

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
    // locally remove the user from this voice channel when he leaves
    if(currentVoiceChannelId !== id){
      setUsers(users.filter(e => e.id !== user.id))
      setHoveredVoiceChannelId("")
    }
  },[currentVoiceChannelId])

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
      play()
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