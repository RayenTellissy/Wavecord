import React, { useEffect, useState } from 'react';
import { AddIcon } from "@chakra-ui/icons"
import axios from 'axios';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverFooter,
  PopoverBody
} from '@chakra-ui/react'

// components
import AddDM from './AddDM';

// styles
import "./DirectMessagesText.css"

const DirectMessagesText = ({ id }) => {
  const [friends,setFriends] = useState([])
  const [query,setQuery] = useState("")
  const [constantFriends,setConstantFriends] = useState([])
  const [chosenFriend,setChosenFriend] = useState("")

  useEffect(() => {
    filterFriends()
  },[query])

  const fetchFriends = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchAllFriends`,{
        id: id
      })
      setFriends(response.data)
      setConstantFriends(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const createDM = async () => {
    if(!chosenFriend) return

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
      <Popover placement='bottom-start'>
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
                  id={e.users[0].id}
                  username={e.users[0].username}
                  image={e.users[0].image}
                  status={e.users[0].status}
                  setChosenFriend={setChosenFriend}
                />
              })}
            </PopoverBody>
            <PopoverFooter padding="20px 0px" bgColor="#313338" borderBottomRadius={4} borderColor="#292929">
              <div id='add-dm-popover-submit-container'>
                <button id='add-dm-popover-submit'>
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