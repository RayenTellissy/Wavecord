import React, { useEffect, useState } from 'react';

// hook for tracking user microphone status
const useMic = () => {
  const localMic = localStorage.getItem("microphoneEnabled") // string to be JSON parsed
  const [micEnabled,setMicEnabled] = useState(localMic ? JSON.parse(localMic) : undefined)

  useEffect(() => {
    if(micEnabled === undefined || micEnabled === true){
      localStorage.setItem("microphoneEnabled", true)
    }
    else if(micEnabled === false){
      localStorage.setItem("microphoneEnabled", false)
    }
  },[micEnabled])

  return [micEnabled,setMicEnabled]
};

export default useMic;