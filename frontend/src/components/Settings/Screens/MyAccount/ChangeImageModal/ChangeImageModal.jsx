import React, { useContext, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"
import { BiImageAdd } from "react-icons/bi"
import axios from 'axios';
import imageCompression from "browser-image-compression"
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

// components
import { Context } from '../../../../Context/Context';
import { storage } from "../../../../../Firebase/FirebaseApp"

// styles
import "./ChangeImageModal.css"
import BeatLoader from 'react-spinners/BeatLoader';

const ChangeImageModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useContext(Context)
  const [image,setImage] = useState(null)
  const [isLoading,setIsLoading] = useState(false)

  const importImage = (e) => {
    const file = e.target.files[0]
    setImage(file)

    const reader = new FileReader()

    reader.onload = (e) => {
      setImage(e.target.result)
    }

    if (file) {
      reader.readAsDataURL(file)
    }
  }

  const handleUpload = async () => {
    if(!image) return

    setIsLoading(true)
    try {
      // compressing image
      const imageResponse = await axios.get(image, {
        responseType: "blob"
      })
      const blob = imageResponse.data
  
      const options = {
        maxSizeMB: 0.003
      }
      const compressedImage = await imageCompression(blob, options)
  
      const imageRef = ref(storage, `profile_pictures/${v4()}`)

      await uploadBytes(imageRef, compressedImage)
      const imageUrl = await getDownloadURL(imageRef)

      setUser(prevUser => ({
        ...prevUser,
        image: imageUrl
      }))

      await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/changeAvatar`, {
        id: user.id,
        imageUrl
      }, {
        withCredentials: true
      })
      setIsLoading(false)
      closeModal()
    }
    catch(error){
      console.log(error)
    }
  }

  const closeModal = () => {
    setImage(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bgColor={"blackAlpha.700"}/>
      <ModalContent borderTopRadius={3} bgColor="#313338">
        <ModalHeader>
          <div id='change-image-header'>
            Change your avatar!
          </div>
        </ModalHeader>
        <ModalBody>
          <div id='change-image-body'>
            <label htmlFor='change-image-input'>
              {image ? <img id='change-image-preview' src={image} /> : (
                <div id='change-image-button'>
                  <BiImageAdd size={100}/>
                  <p id='change-image-upload-text'>Upload</p>
                </div>
              )}
            </label>
            <input id='change-image-input' type='file' onChange={importImage}/>
          </div>
        </ModalBody>
        <ModalFooter borderBottomRadius={3} bgColor={"#2a2c31"} h={16}>
          <div id='change-image-footer'>
            <button id='change-image-cancel-button' onClick={closeModal}>Cancel</button>
            <button
              id={!image ? 'change-image-upload-button-disabled' : 'change-image-upload-button'}
              disabled={!image}
              onClick={handleUpload}
            >
              {isLoading ? <BeatLoader size={8} color='white' /> : "Upload"}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ChangeImageModal;