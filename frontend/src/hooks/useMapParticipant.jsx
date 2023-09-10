import React, { useEffect, useState } from 'react';

const useMapParticipant = (users) => {
  const [mappedUsers,setMappedUsers] = useState([])

  const mapUsers = () => {
    var arr = []
    for(i in users){
      var current = {
        metadata: JSON.parse(users[i].metadata),
        isSpeaking,
      }
    }
  }

  useEffect(() => {
    mapUsers()
    // const mappedData = users.map(e => ({
    //     id: JSON.parse(e.metadata),
    //     username: JSON.parse(e.username),
    //     image: JSON.parse(e.image),
    //     isSpeaking: e.isSpeaking,
    //     connectionQuality: e.connectionQuality,
    //     microphoneEnabled: e.microphoneEnabled,
    //     screenShareEnabled: e.screenShareEnabled,
    //     cameraEnabled: e.cameraEnabled
    // }))
    // console.log(mappedData)
  
    setMappedUsers(mappedData)
  },[])

  return  { mappedUsers }
};

export default useMapParticipant;