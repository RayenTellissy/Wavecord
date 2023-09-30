import React, { useContext, useEffect } from 'react';
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
}) => {
  const { user, socket, micEnabled, setCurrentVoiceChannelId } = useContext(Context)
  const { token, setToken } = useContext(Context)

  useEffect(() => {
    socket.emit("open_server", serverId)
  },[])

  useEffect(() => {
    getToken()
  },[user,channelId])

  // getting token from the server to access voice channel
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
    }
    catch(error){
      console.log(error)
    }
  }

  // callback function when user joins a voice room
  const handleConnect = async () => {
    if(!channelId) return
    try {
      socket.emit("voice_connected", {
        serverId,
        channelId,
        user: {
          id: user.id,
          username: user.username,
          image: user.image,
          micEnabled
        }
      })
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/joinVoiceRoom`,{
        userId: user.id,
        channelId
      }, {
        withCredentials: true
      })
    }
    catch(error){
      console.log(error)
    }
  }

  // callback function when user disonnect from a voice room
  const handleDisconnect = async () => {
    if(!channelId) return
    setCurrentVoiceChannelId("")
    setCurrentChannelType("")
    socket.emit("leave_voice", {
      serverId,
      channelId,
      userId: user.id
    })
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
        style={{ backgroundColor: "black"}}
      >
        <ContextTransfer
          serverId={serverId}
          channelId={channelId}
        />
        <VideoConference/>
      </LiveKitRoom>
    </div>
  );
};

export default VoiceRoom;