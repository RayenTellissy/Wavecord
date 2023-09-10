import React, { useEffect } from 'react';
import { useRoomContext, useParticipants } from '@livekit/components-react';

const ContextTransfer = () => {
  const room = useRoomContext()
  const participants = useParticipants()
  
  // useEffect(() => {
  //   console.log(participants[0].isSpeaking)
  // },[participants])

  return (
    <div>
      {/* {participants.map((e,i) => {
        return <p>{e}</p>
      })} */}
    </div>
  );
};

export default ContextTransfer;