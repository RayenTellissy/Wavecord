import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { BsEmojiSmileFill, BsLink45Deg } from "react-icons/bs"
import imageCompression from 'browser-image-compression';
import { v4 } from "uuid"
import { createId } from "@paralleldrive/cuid2"
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

// helper functions
import sortConversations from '../../../utils/Helper/sortConversations';

const MessageInput = ({
  message,
  setMessage,
  user,
  conversationName,
  setMessages,
  conversationType,
  channelId,
  roleColor
}) => {
  const { socket, conversations, setConversations, conversationChosen } = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [showEmoji,setShowEmoji] = useState(false)
  const [image,setImage] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
  },[channelId])

  // function to send a message 
  const sendMessage = async () => {
    if(message === "" || message.length > 500) return // if the no message was written, or too long nothing will happen
    const storedMessage = message
    setMessage("")
    
    if(conversationType === "dm"){
      const messageId = createId()
      const messageDetails = {
        conversation: channelId,
        id: messageId,
        sender: {
          id: user.id,
          username: user.username,
          image: user.image
        },
        message: storedMessage,
        type: "TEXT",
        created_at: new Date(Date.now())
      }
      setConversations(sortConversations(channelId, conversations)) // placing the current conversation at the top
      setMessages(prevMessages => [...prevMessages, messageDetails])
      socket.emit("send_message", messageDetails)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/sendMessage`, {
        id: messageId,
        conversationId: channelId,
        senderId: user.id,
        message: storedMessage
      }, {
        withCredentials: true
      })
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/notifications/createDirectMessageNotification`, {
        senderId: user.id,
        recipientId: conversationChosen.id,
        conversationId: channelId
      }, {
        withCredentials: true
      })
      // if notification was created (recipient is not in the room). emit socket event
      if(response.data.success){
        socket.emit("send_direct_message_notification", {
          conversationId: channelId,
          userId: conversationChosen.id,
          id: user.id,
          username: user.username,
          image: user.image,
          status: user.status,
          message: storedMessage
        })
      }
    }
    else if(conversationType === "server"){
      const messageId = createId()
      const messageDetails = {
        conversation: channelId,
        id: messageId,
        sender: {
          id: user.id,
          username: user.username,
          image: user.image,
          UsersInServers: [
            {
              role: {
                color: roleColor
              }
            }
          ]
        },
        message: storedMessage,
        type: "TEXT",
        created_at: new Date(Date.now())
      }
      setMessages(prevMessages => [...prevMessages, messageDetails])
      socket.emit("send_message", messageDetails)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/sendMessage`,{
        id: messageId,
        channelId: channelId,
        senderId: user.id,
        message: message
      }, {
        withCredentials: true
      })
    }
  }

  // function to import an image from the user's device
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

  // function to upload the imported image to a cloud storage, and send it as a message
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
    if(conversationType === "dm"){
      const messageId = createId()
      const messageDetails = {
        conversation: channelId,
        id: messageId,
        sender: {
          id: user.id,
          username: user.username,
          image: user.image
        },
        message: url,
        type: "LINK",
        created_at: new Date(Date.now())
      }
      try {
        setMessages(prevMessages => [...prevMessages, messageDetails])
        socket.emit("send_message", messageDetails)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/sendMessage`,{
          id: messageId,
          conversationId: channelId,
          senderId: user.id,
          message: url,
          type: "LINK"
        }, {
          withCredentials: true
        })
        const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/notifications/createDirectMessageNotification`, {
          senderId: user.id,
          recipientId: conversationChosen.id
        }, {
          withCredentials: true
        })
        // if notification was created (recipient is not in the room). emit socket event
        if(response.data.success){
          socket.emit("send_notification", {
            userId: conversationChosen.id,
            message: url
          })
        }
      }
      catch(error){
        console.log(error)
      }
    }
    else if(conversationType === "server"){
      const messageId = createId()
      const messageDetails = {
        conversation: channelId,
        id: messageId,
        sender: {
          id: user.id,
          username: user.username,
          image: user.image,
          UsersInServers: [
            {
              role: {
                color: roleColor
              }
            }
          ]
        },
        message: url,
        type: "LINK",
        created_at: new Date(Date.now())
      }
      try {
        setMessages(prevMessages => [...prevMessages, messageDetails])
        socket.emit("send_message", messageDetails)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/sendMessage`,{
          id: messageId,
          channelId,
          senderId: user.id,
          message: url,
          type: "LINK"
        }, {
          withCredentials: true
        })
      }
      catch(error){
        console.log(error)
      }
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
        autoComplete='off'
        ref={inputRef}
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