import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import {
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast
} from "@chakra-ui/react"
import axios from 'axios';
import BeatLoader from 'react-spinners/BeatLoader';

// components
import { Context } from '../../../../Context/Context';

const Join = ({ onClose, setScreen }) => {
  const { user } = useContext(Context)
  const [joinDisabled,setJoinDisabled] = useState(false)
  const [invite,setInvite] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    console.log(invite)
    console.log(user.id)
  },[invite])

  const handleSubmit = async () => {
    if(invite === ""){
      return toast({
        title: "Failed",
        description: "Please type an invite code.",
        status: "error",
        duration: 1500,
        isClosable: true,
        position: "top",
      })
    }

    setJoinDisabled(true)
    setIsLoading(true)

    // join server function
    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/join`,{
      userId: user.id,
      invite
    })
    console.log(response.data)

    if(response.data.status === "BANNED"){
      onClose()
      return toast({
        title: response.data.error,
        status: "error",
        duration: 1500,
        position: "top"
      })
    }

    // if user is already a member return this alert
    if(!response.data.success){
      onClose()
      return toast({
        title: "Failed",
        description: response.data.message,
        status: response.data.status,
        duration: 1500,
        isClosable: true,
        position: "top",
      })
    }

    onClose() // close modal
    navigate(`/server/${response.data.serverId}`) // reloads
  }

  return <>
    <ModalHeader fontSize={35} alignSelf="center" fontFamily="UbuntuBold">Join a Server</ModalHeader>
      <ModalBody>
        <div id='home-server-bar-modal-container'>
          <p className='home-server-bar-modal-text'>Enter an invite below to join an existing server</p>
          </div>
      </ModalBody>
      <ModalFooter>
        <div id='home-server-bar-modal-seperator-create-container'>
          <div id='home-server-bar-modal-seperator-create'>
            <p id='home-server-bar-modal-seperator-label'>Invite link</p>
            <input 
              id='home-server-bar-modal-seperator-input' 
              type="text"
              onChange={e => setInvite(e.target.value)}
              autoFocus
              autoComplete='off'
              value={invite}
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
            disabled={joinDisabled}
            id='home-server-bar-modal-seperator-create-create'
            className='home-server-bar-modal-seperator-create-button'
            onClick={handleSubmit}
          >{isLoading ? <BeatLoader size={8} color='white'/> : "Join Server"}</button>
        </div>
      </div>
    </ModalFooter>
  </>
};

export default Join;