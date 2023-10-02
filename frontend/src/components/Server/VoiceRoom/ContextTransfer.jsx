import React, { useContext, useEffect, useState } from 'react';
import { useRoomContext, useParticipants } from '@livekit/components-react';
import axios from 'axios';
import useSound from "use-sound"

// sounds
import JoinRoom from "../../../assets/sounds/JoinRoom.mp3"

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
    cameraEnabled,
    setCameraEnabled,
    setIsSpeaking,
    setScreenShareEnabled,
    selectScreenShare,
    setSelectScreenShare,
    setConnectionQuality,
    setCurrentVoiceChannelId
  } = useContext(Context)
  const participants = useParticipants()
  const room = useRoomContext()
  const [connected,setConnected] = useState(false)
  const [playJoin] = useSound(JoinRoom, { volume: 0.2 })

  // watching if user left the room
  useEffect(() => {
    if(!channelId){
      room.disconnect()
    }
  },[channelId])

  useEffect(() => {
    room.on("disconnected", async () => {
      try {
        setCurrentVoiceChannelId("")
        setConnectionQuality(null)
        socket.emit("leave_voice", {
          serverId,
          channelId,
          userId: user.id
        })
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/leaveVoiceRoom`, {
          id: user.id
        }, {
          withCredentials: true
        })
      }
      catch(error){
        console.log(error)
      }
    })

    room.on("connected", () => {
      setConnected(true)
      setConnectionQuality(room.localParticipant.connectionQuality)
    })

    room.on("participantConnected", () => {
      // using a sound activator, because the browser only allows sounds to be played on user action
      document.getElementById("voice-channel-join-sound-activator").click()
    })

    room.on("participantDisconnected", () => {
      // using a sound activator, because the browser only allows sounds to be played on user action
      document.getElementById("voice-channel-leave-sound-activator").click()
    })
  },[room])

  useEffect(() => {
    if(connected){
      room.localParticipant.setMicrophoneEnabled(micEnabled)
    }
  },[room.localParticipant.isMicrophoneEnabled])

  useEffect(() => {
    if(connected){
      room.localParticipant.setMicrophoneEnabled(micEnabled)
    }
  },[micEnabled])

  useEffect(() => {
    if(connected){
      room.localParticipant.setCameraEnabled(cameraEnabled)
    }
  },[cameraEnabled])

  useEffect(() => {
    room.localParticipant.setScreenShareEnabled(selectScreenShare)
    setSelectScreenShare(false)
  },[selectScreenShare])
  
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
    setScreenShareEnabled(room.localParticipant.isScreenShareEnabled)
    handleLocalScreenShare(room.localParticipant.isScreenShareEnabled,setScreenShareEnabled)
  },[room.localParticipant.isScreenShareEnabled])

  const handleRoomEvents = () => {
    room.localParticipant.on("trackMuted", () => localMute(setMicEnabled))
    room.localParticipant.on("trackUnmuted", () => localUnmute(setMicEnabled))
    room.localParticipant.on("isSpeakingChanged", (localSpeaking) => handleSpeaking(localSpeaking,setIsSpeaking))
    room.localParticipant.on("connectionQualityChanged", quality => setConnectionQuality(quality))
  }

  return <></>
};

export default ContextTransfer;