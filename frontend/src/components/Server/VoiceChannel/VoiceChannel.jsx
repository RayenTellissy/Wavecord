import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { HiSpeakerWave } from "react-icons/hi2"
import { useRoomContext } from '@livekit/components-react';

// components
import { Context } from '../../Context/Context';
import UserInRoom from './UserInRoom/UserInRoom';

// styles
import "./VoiceChannel.css"

const VoiceChannel = ({ id, name, setCurrentChannelType, setCurrentVoiceChannelId }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])

  useEffect(() => {
    fetchUsersInRoom()
    return () => leaveRoom()
  },[])

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
    const userDetails = {
      id: user.id,
      username: user.username,
      image: user.image,
      muted: user.muted,
      deafened: user.deafened
    }
    setUsers(prevUsers => [...prevUsers, userDetails])
    setCurrentVoiceChannelId(id)
    setCurrentChannelType("voice")
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/joinVoiceRoom`,{
        userId: user.id,
        channelId: id
      })
    }
    catch(error){
      console.log(error)
    }
  }

  // function to leave the current voice room
  const leaveRoom = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/leaveVoiceRoom`,{
        id: user.id
      })
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <button id='server-voice-channel-button' onClick={handleClick}>
      <div id='server-voice-channel-title-container'>
        <HiSpeakerWave id='server-voice-channel-speaker'/>
        <p id='server-voice-channel-name'>{ name }</p>
      </div>
      {users.map((e,i) => {
        return <UserInRoom
          key={i}
          id={e.id}
          username={e.username}
          image={e.image}
        />
      })}
    </button>
  );
};

export default VoiceChannel;