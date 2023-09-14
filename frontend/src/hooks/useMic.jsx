import React, { useEffect, useState } from 'react';
import Cookies from "js-cookie"

// hook for tracking user microphone status
const useMic = () => {
  const cookie = Cookies.get("microphoneEnabled") // string to be JSON parsed
  const [micEnabled,setMicEnabled] = useState(cookie ? JSON.parse(cookie) : undefined)

  useEffect(() => {
    // if cookie is not set it will set microphoneEnabled to true automatically
    if(micEnabled === undefined){
      Cookies.set("microphoneEnabled", true)
    }
    else if(micEnabled === false){
      Cookies.set("microphoneEnabled", false)
    }
  },[micEnabled])

  return [micEnabled,setMicEnabled]
};

export default useMic;