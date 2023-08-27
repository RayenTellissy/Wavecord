import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom"
import { AddIcon } from "@chakra-ui/icons"
import axios from 'axios';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverFooter,
  PopoverBody,
  useDisclosure
} from '@chakra-ui/react'

// components
import AddDM from './AddDM';

// styles
import "./DirectMessagesText.css"

const DirectMessagesText = ({ id, fetchConversations }) => {
  const { onOpen, onClose, isOpen } = useDisclosure()
  const [friends,setFriends] = useState([])
  const [query,setQuery] = useState("")
  const [constantFriends,setConstantFriends] = useState([])
  const [checked,setChecked] = useState("")
  const [submitDisabled,setSubmitDisabled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    filterFriends()
  },[query])

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/fetchFriendsWithNoConversations/${id}`,{
        withCredentials: true
      })
      console.log(response.data)
      setFriends(response.data)
      setConstantFriends(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const createDM = async () => {
    if(submitDisabled) return
    if(!checked) return
    try {
      setSubmitDisabled(true)
      onClose()
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/createDM`,{
        currentUser: id,
        otherUser: checked
      })
      setChecked("")
      fetchConversations()
      navigate(`/dm/${response.data.id}`)
      setSubmitDisabled(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const filterFriends = () => {
    if(!query){
      return setFriends(constantFriends)
    }
    setFriends(friends.filter(e => e.users[0].username.toUpperCase().includes(query.toUpperCase())))
  }

  return (
    <div id='home-contacts-side-messages'>
      <p id='home-contacts-side-message-text'>
        DIRECT MESSAGES
      </p>
      <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} placement='bottom-start'>
        <PopoverTrigger>
          <button>
            <AddIcon onClick={fetchFriends}/>
          </button>
        </PopoverTrigger>
        <PopoverContent minW={{ base: "100%", lg: "max-content" }} borderRadius={4} backgroundColor="#313338" border="1px solid #222327">
          <div id='add-dm-popover-container'>
            <div id='add-dm-popover-header-main'>
              <div id='add-dm-popover-header-container'>
                <p id='add-dm-popover-header-text'>Select Friends</p>
              </div>
              <div id='add-dm-popover-input-container'>
                <input
                  id='add-dm-popover-search'
                  type='text' 
                  placeholder='Type the username of a friend'
                  onChange={e => setQuery(e.target.value)}
                />
              </div>
            </div>
            <PopoverBody maxHeight="30vh" overflowY="scroll" bgColor="#313338">
              {friends.map((e,i) => {
                return <AddDM
                  key={i}
                  id={e.id}
                  username={e.username}
                  image={e.image}
                  status={e.status}
                  checked={checked}
                  setChecked={setChecked}
                />
              })}
            </PopoverBody>
            <PopoverFooter padding="20px 0px" bgColor="#313338" borderBottomRadius={4} borderColor="#292929">
              <div id='add-dm-popover-submit-container'>
                <button id='add-dm-popover-submit' onClick={createDM}>
                  <p id='add-dm-popover-submit-text'>Create DM</p>
                </button>
              </div>
            </PopoverFooter>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DirectMessagesText;