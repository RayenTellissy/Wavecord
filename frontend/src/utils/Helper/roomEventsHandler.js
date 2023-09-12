import Cookies from "js-cookie"

const localMute = (setMicEnabled) => {
  setMicEnabled(false)
  Cookies.set("microphoneEnabled", false)
}

const localUnmute = (setMicEnabled) => {
  setMicEnabled(true)
  Cookies.set("microphoneEnabled", true)
}

const handleLocalCamera = (isCameraEnabled,setCameraEnabled) => {
  if(isCameraEnabled){
    return setCameraEnabled(true)
  }
  setCameraEnabled(false)
}

const handleSpeaking = (isSpeaking,setIsSpeaking) => {
  if(isSpeaking){
    return setIsSpeaking(true)
  }
  setIsSpeaking(false)
}

const handleLocalScreenShare = (screenShareEnabled,setScreenShareEnabled) => {
  if(screenShareEnabled){
    return setScreenShareEnabled(true)
  }
  setScreenShareEnabled(false)
}

export { localMute, localUnmute, handleLocalCamera, handleSpeaking, handleLocalScreenShare }