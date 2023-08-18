import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDisclosure } from '@chakra-ui/react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react"
import { FaHashtag } from "react-icons/fa"

// components
import Sidebar from '../Home/Sidebar/Sidebar';
import Category from './Category/Category';

// styles
import "./Server.css"

const Server = () => {
  const { id } = useParams()
  const [server,setServer] = useState({})
  const [currentTextChannel,setCurrentTextChannel] = useState("")
  const [categoryChosen,setCategoryChosen] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [modalChannelType,setModalChannelType] = useState("text")
  
  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${id}`)
      setServer(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-container'>
      <Sidebar highlighted={server.id}/>
      <div id='server-bar-container'>
        <div id='server-bar-main'>
          <div id='server-name-container'>
            <p id='server-name'>{server.name}</p>
          </div>
          {server.categories && server.categories.map((e,i) => {
            return <Category
              key={i}
              id={e.id}
              name={e.name}
              text={e.Text_channels}
              voice={e.Voice_channels}
              onOpen={onOpen}
              setCategoryChosen={setCategoryChosen}
            />
          })}
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
        <ModalOverlay/>
        <ModalContent  borderRadius={10} bg="#313338">
          <ModalHeader>
            <p id='server-category-modal-header-1'>Create Channel</p>
            <p id='server-category-modal-header-2'>in {categoryChosen}</p>
          </ModalHeader>
          <ModalCloseButton size="lg" color="#72767c"/>
          <ModalBody>
            <div id='server-category-modal-body-container'>
              <p id='server-category-modal-body-channel-type'>CHANNEL TYPE</p>
              <button 
                className='server-category-modal-body-text-type' 
                id={modalChannelType === "text" ? 'server-category-modal-body-text-type-active' : 'server-category-modal-body-text-type-inactive'}
                onClick={() => setModalChannelType("text")}
              >
                <div id='server-category-modal-body-text-type-container'>
                  <FaHashtag id='server-category-modal-body-text-type-hashtag' size={28} color='#b3b4b7'/>
                  <div className='server-category-modal-body-type-details'>
                    <p className='server-category-modal-body-type-title'>Text</p>
                    <p className='server-category-modal-body-type-description'>Send messages, images, GIFs, emoji, opinions, and puns</p>
                  </div>
                </div>
              </button>
              <button id='server-category-modal-body-voice-type' onClick={() => setModalChannelType("voice")}>Voice</button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Server;