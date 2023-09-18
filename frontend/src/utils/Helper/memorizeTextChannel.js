const memorizeTextChannel = (serverId, currentTextChannelId, currentTextChannel) => {
  const latest = localStorage.getItem("latestTextChannels")
  if(!latest){
    const obj = {
      [serverId]: {
        id: currentTextChannelId,
        name: currentTextChannel
      }
    }
    localStorage.setItem("latestTextChannels", JSON.stringify(obj))
  }
  else {
    if(currentTextChannelId){
      var parsedLatest = JSON.parse(localStorage.getItem("latestTextChannels"))
      parsedLatest[serverId] = {
        id: currentTextChannelId,
        name: currentTextChannel
      }
      localStorage.setItem("latestTextChannels", JSON.stringify(parsedLatest))
    }
  }
}

const applyMemorization = (serverId, setCurrentTextChannelId, setCurrentTextChannel) => {
  const latestText = localStorage.getItem("latestTextChannels")
  if(latestText && JSON.parse(latestText)[serverId]){
    setCurrentTextChannelId(JSON.parse(latestText)[serverId].id)
    setCurrentTextChannel(JSON.parse(latestText)[serverId].name)
  }
}

export { memorizeTextChannel, applyMemorization }