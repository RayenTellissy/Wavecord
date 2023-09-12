import React, { useContext, useEffect } from 'react';
import { useRoomContext, useParticipants } from '@livekit/components-react';

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
    socket,
    setMicEnabled,
    setCameraEnabled,
    setIsSpeaking,
    setScreenShareEnabled
  } = useContext(Context)
  const participants = useParticipants()
  const room = useRoomContext()
  
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
    room.localParticipant.on("trackUnmuted", () => localUnmute(setMicEnabled))
    room.localParticipant.on("trackMuted", () => localMute(setMicEnabled))
    room.localParticipant.on("isSpeakingChanged", (localSpeaking) => handleSpeaking(localSpeaking,setIsSpeaking))
  }

  return (
    <div>
    </div>
  );
};

export default ContextTransfer;