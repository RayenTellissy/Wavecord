import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from "@chakra-ui/react"

// components
import { Context } from '../../../Context/Context';
import Loader from '../../../common/Loader/Loader';

// style
import "./AddFriend.css"

const AddFriend = ({ setShowSearch }) => {
  const { user } = useContext(Context)
  const [query,setQuery] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [isDisabled,setIsDisabled] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setShowSearch(false)
    return () => setShowSearch(true)
  },[])

  const handleSubmit = async () => {
    if(isDisabled) return
    setIsDisabled(true)
    setQuery("")
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/addFriend`,{
        sender: user.id,
        recipient: query
      })

      if(response.data.userExists === false){
        toast({
          description: "User does not exist.",
          status: "warning",
          duration: 2000
        })
      }

      if(response.data.alreadyFriends === true){
        toast({
          description: `You are already friends with ${response.data.friend}.`,
          status: "info",
          duration: 2000
        })
      }

      if(response.data.alreadyRequested === true){
        toast({
          description: `You have already sent ${response.data.recipient} a friend request.`,
          status: "warning",
          duration: 2000
        })
      }

      if(response.data.recipientAlreadyRequested === true){
        toast({
          description: `${response.data.recipient} already sent you a friend request.`,
          status: "warning",
          duration: 2000
        })
      }

      if(response.data.userBlocked){
        toast({
          description: "You cannot send this user a friend request.",
          status: "warning",
          duration: 2000
        })
      }

      if(response.data.success){
        toast({
          description: "Friend request sent.",
          status: "success",
          duration: 2000
        })
      }
      
      setIsLoading(false)
      setIsDisabled(false)
    }
    catch(error){
      console.log(error)
    }
  }
  
  return (
    <div id='home-right-display-addfriend-container'>
      <div id='home-right-display-addfriend-main'>
        <h2 id='home-right-display-addfriend-title'>ADD FRIEND</h2>
        <p id='home-right-display-addfriend-text'>You can add friends with their Wavecord username.</p>
        <div id='home-right-display-addfriend-input-container'>
          <input 
            className='home-right-display-addfriend-input'
            type='text'
            placeholder='You can add friends with their Wavecord username.'
            onChange={e => setQuery(e.target.value)}
            value={query}
          />
          <button 
            className='home-right-display-addfriend-submit'
            id={query === "" ? "addfriend-submit-inactive" : "addfriend-submit-active"}
            onClick={handleSubmit}
          >
            Send Friend Request
          </button>
        </div>
        {isLoading && <Loader/>}
      </div>
    </div>
  );
};

export default AddFriend;