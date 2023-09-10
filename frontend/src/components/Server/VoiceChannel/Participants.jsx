import React, { useEffect } from 'react';
import { useRoomContext, useParticipants } from '@livekit/components-react';

import useMapParticipant from '../../../hooks/useMapParticipant';

const Participants = ({ setUsers }) => {
  const room = useRoomContext()
  const participants = useParticipants()
  // const { mappedUsers } = useMapParticipant(participants)

  useEffect(() => {
    setUsers(participants)
    console.log(participants)
    console.log(participants[0].isMicrophoneEnabled)
  },[])

  // useEffect(() => {
  //   console.log(mappedUsers)
  // },[mappedUsers])

  return (
    <div>
      
    </div>
  );
};

export default Participants;