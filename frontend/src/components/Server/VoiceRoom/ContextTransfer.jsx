import React, { useContext, useEffect } from 'react';
import { useRoomContext, useParticipants } from '@livekit/components-react';

// components
import { Context } from '../../Context/Context';

// helper functions
import returnParticipantsInfo from "../../../utils/Helper/returnParticipantsInfo"

const ContextTransfer = ({ serverId, channelId, voiceChannels, setVoiceChannels }) => {
  const { socket } = useContext(Context)
  const room = useRoomContext()
  const participants = useParticipants()
  
  useEffect(() => {
    socket.emit("voice_updated", {
      serverId,
      channelId,
      users: returnParticipantsInfo(participants)
    })
    // console.log(participants[0].connectionQuality)
    // handleVoiceEvent()
  },[participants])

  // const handleVoiceEvent = () => {
  //   // console.log("event!!")
  //   var users = voiceChannels
  //   users[channelId] = participants
  //   socket.emit("voice_updated", {
  //     users,
  //     serverId
  //   })
  // }

  return (
    <div>
      {/* {participants.map((e,i) => {
        return <p>{e}</p>
      })} */}
    </div>
  );
};

export default ContextTransfer;