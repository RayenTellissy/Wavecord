import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import "@livekit/components-styles"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"

// components
import { Context } from '../../Context/Context';

const VoiceRoom = ({ channelId }) => {
  const { user } = useContext(Context)
  const [token,setToken] = useState("")

  useEffect(() => {
    getToken()
  },[user,channelId])

  const getToken = async () => {
    if(!channelId) return
    try {
      const response = await axios.get(`${import.meta.env.VITE_LIVEKIT_URL}/getToken/${channelId}/${user.username}`)
      setToken(response.data)
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
      >
        <VideoConference/>
      </LiveKitRoom>
    </div>
  );
};

export default VoiceRoom;