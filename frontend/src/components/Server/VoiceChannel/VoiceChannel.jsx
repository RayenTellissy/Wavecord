import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { HiSpeakerWave } from "react-icons/hi2"
import { useRoomContext, useParticipants, VideoConference } from '@livekit/components-react';

// components
import { Context } from '../../Context/Context';
import UserInRoom from './UserInRoom/UserInRoom';

// styles
import "./VoiceChannel.css"
import useMapParticipant from '../../../hooks/useMapParticipant';

const VoiceChannel = ({ id, name, setCurrentChannelType, setCurrentVoiceChannelId }) => {
  const { user, socket } = useContext(Context)
  const room = useRoomContext()
  const [users,setUsers] = useState([])
  // const { mappedUsers } = useMapParticipant(users)

  useEffect(() => {
    fetchUsersInRoom()
  },[])

  useEffect(() => {
    socket.on("receive_join", data => {
      fetchUsersInRoom()
    })
    socket.on("receive_leave", data => {
      fetchUsersInRoom()
    })
  },[socket])

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
      channelId: id
    }
    var inRoom = false
    users.map(e => {
      if(e.id === user.id){
        inRoom = true
      }
    })
    if(!inRoom){
      setUsers(prevUsers => [...prevUsers, userDetails])
    }
    setCurrentVoiceChannelId(id)
    setCurrentChannelType("voice")
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
      {/* <VideoConference/> */}
    </button>
  );
};

export default VoiceChannel;