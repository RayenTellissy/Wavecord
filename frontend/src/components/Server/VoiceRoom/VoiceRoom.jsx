import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import "@livekit/components-styles"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"

// components
import { Context } from '../../Context/Context';
import ContextTransfer from './ContextTransfer';

const VoiceRoom = ({
  serverId,
  channelId,
  setCurrentChannelType,
  setVoiceTokens,
  voiceChannels,
  setVoiceChannels,
  setCurrentVoiceChannelId
}) => {
  const { user, socket } = useContext(Context)
  const [token,setToken] = useState("")

  useEffect(() => {
    socket.emit("open_server", serverId)
  },[])

  useEffect(() => {
    getToken()
  },[user,channelId])

  const getToken = async () => {
    if(!channelId) return
    try {
      const response = await axios.post(`${import.meta.env.VITE_LIVEKIT_URL}/getToken`,{
        channelId,
        id: user.id,
        username: user.username,
        image: user.image
      })
      setToken(response.data)
      setVoiceTokens(prevVoiceTokens => ({...prevVoiceTokens, [channelId]: response.data}))
    }
    catch(error){
      console.log(error)
    }
  }

  // callback function when user joins a voice room
  const handleConnect = async () => {
    if(!channelId) return
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/joinVoiceRoom`,{
        userId: user.id,
        channelId
      })
    }
    catch(error){
      console.log(error)
    }
  }

  // callback function when user disonnect from a voice room
  const handleDisconnect = async () => {
    if(!channelId) return
    try {
      if(voiceChannels[channelId]){
        var channelArray = voiceChannels[channelId]
        const filteredChannel = channelArray.filter(e => JSON.parse(e.metadata).id === user.id)
        setVoiceChannels(prevChannels => ({...prevChannels, [channelId]: filteredChannel}))
      }
      setCurrentVoiceChannelId("")
      setCurrentChannelType("")
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div>
      <LiveKitRoom
        serverUrl={import.meta.env.VITE_LIVEKIT_PUBLIC_URL}
        token={token}
        connect={true}
        audio={true}
        onConnected={handleConnect}
        onDisconnected={handleDisconnect}
      >
        <ContextTransfer
          serverId={serverId}
          channelId={channelId}
          voiceChannels={voiceChannels}
          setVoiceChannels={setVoiceChannels}
        />
        <VideoConference/>
      </LiveKitRoom>
    </div>
  );
};

export default VoiceRoom;