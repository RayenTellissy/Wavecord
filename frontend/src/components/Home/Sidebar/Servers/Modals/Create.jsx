import React, { useContext, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BeatLoader from "react-spinners/BeatLoader"
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast
} from "@chakra-ui/react"
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import axios from "axios"
import imageCompression from "browser-image-compression"

// component
import { storage } from '../../../../../Firebase/FirebaseApp';
import { Context } from "../../../../Context/Context"

const Create = ({ setScreen, onClose }) => {
  const { user } = useContext(Context)
  const [isLoading,setIsLoading] = useState(false)
  const [image,setImage] = useState(null)
  const [createDisabled,setCreateDisabled] = useState(false)
  const [serverName,setServerName] = useState(`${user.username}'s Server`)
  const toast = useToast()
  const navigate = useNavigate()

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

    if(serverName === ""){
      return toast({
        title: "Failed",
        description: "Please type a name for your server",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      })
    }
    
    setCreateDisabled(true) // disabling button
    setIsLoading(true)

    // checking how many servers the user has created
    const count = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/count/${user.id}`,{
      withCredentials: true
    })
    if(!count.data.success){
      onClose()
      return toast({
        title: "Failed",
        description: count.data.message,
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      })
    }
    
    const imageResponse = await axios.get(image, {
      responseType: "blob",
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
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/create/${user.id}`,{
        name: serverName,
        image: url
      })
      
      if(response.data.success === false){
          onClose()
          return toast({
              title: "Failed",
              description: response.data.message,
              status: "warning",
              duration: 3000,
              isClosable: true
            })
          }
      onClose() // closing modal
      navigate(`/server/${response.data.id}`)
    }
    catch(error){
      console.log(error)
    }
  }

  return <>
    <ModalHeader fontSize={35} alignSelf="center" fontFamily="UbuntuBold">Customize your server</ModalHeader>
      <ModalBody>
        <div id='home-server-bar-modal-container'>
          <p className='home-server-bar-modal-text'>Give your new server a personality with a name and an icon. You can always change it later.</p>
          <label id='home-server-bar-modal-create-camera-label' htmlFor='home-server-bar-modal-create-camera'>
            {image ? <img id='home-server-bar-modal-create-picture' src={image} /> : <FontAwesomeIcon style={{ height: 40, width: 40 }} icon={faCamera}/>} 
          </label>
          <input id='home-server-bar-modal-create-camera' type='file' onChange={importImage}/>
        </div>
      </ModalBody>
      <ModalFooter>
        <div id='home-server-bar-modal-seperator-create-container'>
          <div id='home-server-bar-modal-seperator-create'>
            <p id='home-server-bar-modal-seperator-label'>Server name</p>
            <input 
              id='home-server-bar-modal-seperator-input' 
              type="text" 
              value={serverName}
              onChange={e => setServerName(e.target.value)}
              autoFocus
              autoComplete='off'
            />
          </div>
          <div id='home-server-bar-modal-seperator-create-buttons'>
          <button 
            className='home-server-bar-modal-seperator-create-button'
            onClick={() => setScreen("main")}
          >
            Back
          </button>
          <button
            disabled={createDisabled}
            id='home-server-bar-modal-seperator-create-create'
            className='home-server-bar-modal-seperator-create-button'
            onClick={handleSubmit}
          >{isLoading ? <BeatLoader size={8} color='white'/> : "Create"}</button>
        </div>
      </div>
    </ModalFooter>
  </>
};

export default Create;