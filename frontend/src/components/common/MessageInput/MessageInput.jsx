import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsEmojiSmileFill, BsLink45Deg } from "react-icons/bs"
import imageCompression from 'browser-image-compression';
import { v4 } from "uuid"
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalBody, 
  ModalFooter,
  Spinner
} from "@chakra-ui/react"

// components
import { storage } from '../../../Firebase/FirebaseApp';
import { Context } from '../../Context/Context';
import Emoji from '../Emoji/Emoji';

// styles
import "./MessageInput.css"

const MessageInput = ({ user, conversationName, setMessages, conversationType, channelId }) => {
  const { socket } = useContext(Context)
  const { id } = useParams()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showEmoji,setShowEmoji] = useState(false)
  const [message,setMessage] = useState("")
  const [image,setImage] = useState(null)
  const [isLoading,setIsLoading] = useState(false)

  // function to send a message 
  const sendMessage = async () => {
    if(message === "" || message.length > 255) return // if the no message was written, or too long nothing will happen
    const storedMessage = message
    setMessage("")
    
    if(conversationType === "dm"){
      const messageDetails = {
        conversation: id,
        usersId: {
          username: user.username,
          image: user.image
        },
        message: storedMessage,
        type: "TEXT",
        created_at: new Date(Date.now())
      }
      await socket.emit("send_message", messageDetails)
      setMessages(prevMessages => [...prevMessages, messageDetails])
    }
    else if(conversationType === "server"){
      const messageDetails = {
        conversation: channelId,
        sender: { 
          username: user.username,
          image: user.image
        },
        message: storedMessage,
        type: "TEXT",
        created_at: new Date(Date.now())
      }
      await socket.emit("send_message", messageDetails)
      setMessages(prevMessages => [...prevMessages, messageDetails])
    }
    
    try {
      if(conversationType === "dm"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/sendMessage`,{
          conversationId: id,
          senderId: user.id,
          message: storedMessage
        },{
          withCredentials: true
        })
      }
      else if(conversationType === "server"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/sendMessage`,{
          channelId: channelId,
          senderId: user.id,
          message: message
        },{
          withCredentials: true
        })
      }
    }
    catch(error){
      console.log(error)
    }
  }

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
    onOpen()
  }

  const uploadImage = async () => {
    setIsLoading(true)
    const response = await axios.get(image, {
      responseType: "blob",
    })
    const blob = response.data
    
    const options = {
      maxSizeMB: 0.005 // compressing to ~5kb
    }

    // compressing image
    const compressedImage = await imageCompression(blob, options)

    const imageRef = ref(storage, `chat_media/${v4()}`) // creating a storage reference
    await uploadBytes(imageRef, compressedImage) // uploading image

    const url = await getDownloadURL(imageRef)
    const messageDetails = {
      conversation: id,
      usersId: { 
        username: user.username,
        image: user.image
      },
      message: url,
      type: "LINK",
      created_at: new Date(Date.now())
    }
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/sendMessage`,{
        conversationId: id,
        senderId: user.id,
        message: url,
        type: "LINK"
      })
      await socket.emit("send_message", messageDetails)
      setMessages(prevMessages => [...prevMessages, messageDetails])
      
    }
    catch(error){
      console.log(error)
    }
    onClose()
    setImage(null)
    setIsLoading(false)
  }

  return (
    <div id='message-input-container'>
      <div id='emoji-picker-container'>
        {showEmoji && <Emoji onEmojiClick={emoji => setMessage(prevMessage => `${prevMessage}${emoji.emoji}`)}/>}
      </div>
      <button id='message-input-emoji-picker' onClick={() => setShowEmoji(!showEmoji)}>
        <BsEmojiSmileFill size={35}/>
      </button>

      <label id='message-input-link-label' htmlFor='message-input-link-input'>
        <BsLink45Deg size={40}/>
      </label>
      <input id="message-input-link-input" type='file' onChange={importImage} />

      <input id='dm-conversation-input'
        type='text'
        spellCheck={false}
        placeholder={`Message ${conversationType === "dm" ? "@" : "#"}${conversationName}`}
        onChange={e => setMessage(e.target.value)}
        value={message}
        onKeyDown={e => {
          e.key === "Enter" && sendMessage()
        }}
        autoFocus
        autoComplete='off'
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>
            <div id='dm-upload-header'>
              <p id='dm-upload-header-text'>Upload Image</p>
            </div>
          </ModalHeader>
          <ModalBody>
            <img src={image}/>
          </ModalBody>
          <ModalFooter>
            <div id='dm-upload-footer'>
              <button id='dm-upload-footer-submit' onClick={uploadImage}>
                {isLoading ? <Spinner height={5} width={5}/> : <p>Upload</p>}
              </button>
              <button id="dm-upload-footer-cancel" onClick={() => onClose()}>
                Cancel
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MessageInput;