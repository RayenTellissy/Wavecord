import React, { useContext, useEffect } from 'react';
import { useRoomContext, useParticipants } from '@livekit/components-react';
import axios from 'axios';

// components
import { Context } from '../../Context/Context';

// helper functions
import returnParticipantsInfo from "../../../utils/Helper/returnParticipantsInfo"
import {
  localMute,
  localUnmute,
  handleLocalCamera,
  handleSpeaking,
  handleLocalScreenShare
} from '../../../utils/Helper/roomEventsHandler';

const ContextTransfer = ({ serverId, channelId }) => {
  const {
    user,
    socket,
    micEnabled,
    setMicEnabled,
    setCameraEnabled,
    setIsSpeaking,
    setScreenShareEnabled,
    setCurrentVoiceChannelId
  } = useContext(Context)
  const participants = useParticipants()
  const room = useRoomContext()

  useEffect(() => {
    room.on("disconnected", async () => {
      try {
        setCurrentVoiceChannelId("")
        socket.emit("leave_voice", {
          serverId,
          channelId,
          userId: user.id
        })
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/leaveVoiceRoom`, {
          id: user.id
        })
      }
      catch(error){
        console.log(error)
      }
    })
  },[room])

  useEffect(() => {
    if(room.state === "connected"){
      room.localParticipant.setMicrophoneEnabled(micEnabled)
    }
  },[room.localParticipant.isMicrophoneEnabled])

  useEffect(() => {
    if(room.state === "connected"){
      console.log(room.disconnect())
      room.localParticipant.setMicrophoneEnabled(micEnabled)
    }
  },[micEnabled])
  
  useEffect(() => {
    handleRoomEvents()
    socket.emit("voice_updated", {
      serverId,
      channelId,
      users: returnParticipantsInfo(participants)
    })
  },[participants])

  useEffect(() => {
    // handling localparticipant's camera activity
    handleLocalCamera(room.localParticipant.isCameraEnabled,setCameraEnabled)
  },[room.localParticipant.isCameraEnabled])

  useEffect(() => {
    // handling localparticipant's screen share activity
    handleLocalScreenShare(room.localParticipant.isScreenShareEnabled,setScreenShareEnabled)
  },[room.localParticipant.isScreenShareEnabled])

  const handleRoomEvents = () => {
    room.localParticipant.on("trackMuted", () => localMute(setMicEnabled))
    room.localParticipant.on("trackUnmuted", () => localUnmute(setMicEnabled))
    room.localParticipant.on("isSpeakingChanged", (localSpeaking) => handleSpeaking(localSpeaking,setIsSpeaking))
  }

  return (
    <div>
    </div>
  );
};

export default ContextTransfer;