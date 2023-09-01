import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDisclosure, useToast } from "@chakra-ui/react"
import imageCompression from 'browser-image-compression';
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import BeatLoader from 'react-spinners/BeatLoader';

// components
import { storage } from '../../../../../Firebase/FirebaseApp';
import SaveCheck from '../../SaveCheck/SaveCheck';

// styles
import "./Overview.css"

const Overview = ({ server, fetchData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [image,setImage] = useState(null)
  const [serverName,setServerName] = useState(server.name)
  const [isLoading,setIsLoading] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if(serverName !== server.name){
      return onOpen()
    }
    onClose()
  },[serverName])

  useEffect(() => {
    if(image){
      handleSubmit()
    }
  },[image])

  const importImage = (e) => {
    const file = e.target.files[0]
    setImage(file)

    const reader = new FileReader()

    reader.onload = (e) => {
      setImage(e.target.result)
    }

    if(file){
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if(image === null){
      return toast({
        title: "Failed",
        description: "Please upload an image.",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      })
    }

    setIsLoading(true)

    const imageResponse = await axios.get(image, {
      responseType: "blob"
    })
    const blob = imageResponse.data

    const options = {
      maxSizeMB: 0.003 // compressing to ~3kb
    }
    // compressing image
    const compressedImage = await imageCompression(blob, options)

    const imageRef = ref(storage, `server_pictures/${v4()}`) // creating a storage reference
    await uploadBytes(imageRef, compressedImage) // uploading image
    
    const url = await getDownloadURL(imageRef)
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/servers/changeServerImage`,{
        serverId: server.id,
        image: url
      },{
        withCredentials: true
      })
      setImage(null)
      await fetchData()
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }
  
  const handleUploadClick = () => {
    document.getElementById('server-settings-overview-upload-image-input').click()
  }

  const modalReset = () => {
    setServerName(server.name)
  }

  const changeServerName = async () => {
    if(serverName.length < 3) return
    onClose()
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/servers/changeServerName`,{
        serverId: server.id,
        name: serverName
      })
      await fetchData()
    }
    catch(error){
      console.log(error)
    }
  }
  
  return (
    <div id='server-settings-overview-container'>
      <p id='server-settings-overview-title'>Server Overview</p>
      <div id='server-settings-overview-server-image-container'>
        <img id='server-settings-overview-server-image' src={server.image} />
        <div id='server-settings-overview-server-p-container'>
          <p id='server-settings-overview-server-p'>We recommend an image of at least 512x512 for the server.</p>
          <label id='server-settings-overview-label' htmlFor='server-settings-overview-upload-image-input'>
            <button id='server-settings-overview-upload-image' onClick={handleUploadClick}>
              {isLoading ? <BeatLoader size={10} color='white'/> : `Upload Image`}
            </button>
          </label>
          <input id='server-settings-overview-upload-image-input' type='file' onChange={importImage}/>
        </div>
        <div id='server-settings-overview-server-name-input-container'>
          <p id='server-settings-overview-server-name-text'>SERVER NAME</p>
          <input id='server-settings-overview-server-name-input'
            type='text'
            value={serverName}
            onChange={e => setServerName(e.target.value)}
            autoComplete='off'
          />
        </div>
      </div>
      <SaveCheck isOpen={isOpen} resetCb={modalReset} saveCb={changeServerName}/>
    </div>
  );
};

export default Overview;