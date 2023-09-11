const returnParticipantsInfo = (participants) => {
  var arr = []

  participants.map(e => {
    if(!e.metadata) return
    const parsed = JSON.parse(e.metadata)
    const obj = {
      id: parsed.id,
      username: parsed.username,
      image: parsed.image,
      isSpeaking: e.isSpeaking,
      connectionQuality: e.connectionQuality,
      isCameraEnabled: e.isCameraEnabled,
      isMicrophoneEnabled: e.isMicrophoneEnabled,
      isScreenShareEnabled: e.isScreenShareEnabled
    }
    arr.push(obj)
  })

  return arr 
}

export default returnParticipantsInfo