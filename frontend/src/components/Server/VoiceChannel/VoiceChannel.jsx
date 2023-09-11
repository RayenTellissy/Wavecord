import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { HiSpeakerWave } from "react-icons/hi2"
import { useRoomContext, useParticipants } from '@livekit/components-react';

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
  voiceChannels,
  setVoiceChannels,
  serverId
}) => {
  const { user, socket } = useContext(Context)
  const [users,setUsers] = useState([])
  const room = useRoomContext()
  

  useEffect(() => {
    // this will be only invoked when the user disconnects (moving from voice channel to another won't)
    room.on("participantDisconnected", (user) => {
      console.log(JSON.parse(user.metadata).id)
      socket.emit("leave_voice", {
        user: JSON.parse(user.metadata).id,
        channelId: id
      })
    })
  },[room])

  // useEffect(() => {
  //   setVoiceChannels(prevVoice => ({...prevVoice, [id]: participants}))
  //   // fetchUsersInRoom()
  // },[])

  // useEffect(() => {
  //   // console.log(voiceChannels[id])
  //   setUsers(voiceChannels[id])
  // },[voiceChannels])

  useEffect(() => {
    socket.on("receive_voice_update", data => {
      if(data.channelId === id){
        setUsers(data.users)
      }
    })
  },[socket])

  // useEffect(() => {
  //   console.log(users)
  // },[users])

  // useEffect(() => {
  //   setUsers(voiceChannels[id].users)
  // },[voiceChannels])
  
  // useEffect(() => {
  //   socket.on("receive_join", data => {
  //     fetchUsersInRoom()
  //   })
  //   socket.on("receive_leave", data => {
  //     fetchUsersInRoom()
  //   })
  // },[socket])

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
      // if(users){
      //   setUsers(prevUsers => [...prevUsers, userDetails])
      // }
      // setUsers([userDetails])
      setCurrentVoiceChannelId(id)
      setCurrentChannelType("voice")
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
      {users && users.map((e,i) => {
        return <UserInRoom
          key={i}
          id={e.id}
          username={e.username}
          image={e.image}
          isSpeaking={e.isSpeaking}

        />
      })}
    </button>
  );
};

export default VoiceChannel;