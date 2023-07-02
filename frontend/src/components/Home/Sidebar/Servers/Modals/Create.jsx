import React, { useContext, useState } from 'react';
import { faCamera } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import BeatLoader from "react-spinners/BeatLoader"
import {
  ModalHeader,
  ModalBody,
  ModalFooter
} from "@chakra-ui/react"
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import axios from "axios"

// component
import { storage } from '../../../../../Firebase/FirebaseApp';
import { Context } from "../../../../Context/Context"

const Create = ({ serverName, setServerName, setScreen, onClose }) => {
  const { user } = useContext(Context)
  const [isLoading,setIsLoading] = useState(false)
  const [image,setImage] = useState(null)
  const [createDisabled,setCreateDisabled] = useState(false)

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
    setCreateDisabled(true) // disabling button
    if(image === null){
      return alert("choose image")
    }

    setIsLoading(true)

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = function () {
        resolve(xhr.response)
      }
      xhr.onerror = function (e) {
        console.log(e)
        reject(new TypeError("Network request failed"))
      }
      xhr.responseType = "blob"
      xhr.open("GET", image, true)
      xhr.send(null)
    })
    
    const imageRef = ref(storage, `server_pictures/${v4()}`) // creating a storage reference
    await uploadBytes(imageRef, blob) // uploading image
    
    const url = await getDownloadURL(imageRef)
    
    const role = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/getRole/${user.id}`) // fetching user's role
    await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/create/${user.id}`,{
      name: serverName,
      image: url,
      role: role.data
    })

    onClose() // closing modal
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