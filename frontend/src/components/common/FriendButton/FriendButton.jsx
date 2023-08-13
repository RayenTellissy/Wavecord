import React, { useContext } from 'react';
import { TbFriendsOff } from "react-icons/tb"
import { BiBlock } from "react-icons/bi"
import { Tooltip } from '@chakra-ui/react';
import axios from 'axios';

// components
import { Context } from '../../Context/Context';
import Avatar from '../Avatar/Avatar';

// styles
import "./FriendButton.css"

const FriendButton = ({ id, username, image, status, setIsUpdating, fetchUsers, toast }) => {
  const { user } = useContext(Context)

  const removeFriend = async () => {
    setIsUpdating(true)
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/removeFriend`,{
        remover: user.id,
        removed: id
      },{
        withCredentials: true
      })
      await fetchUsers()
      setIsUpdating(false)
      toast({
        description: "Friend removed.",
        status: "success",
        duration: 2000

      })
    }
    catch(error){
      console.log(error)
    }
  }

  const blockUser = async () => {
    setIsUpdating(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/blockUser`,{
        blocker: user.id,
        blocked: id
      },{
        withCredentials: true
      })
      console.log(response.data)
      await fetchUsers()
      setIsUpdating(false)
      toast({
        description: "Friend blocked.",
        status: "success",
        duration: 2000
      })
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <button>
      <div id='friend-button-container'>
        <div id='friend-button-details-container'>
          <Avatar image={image} status={status}/>
          <div id='friend-button-username-status-container'>
            <p id='friend-button-username'>{username}</p>
            <p id='friend-button-status'>
              {status === "ONLINE" ? "Online" : (status === "BUSY" ? "Do Not Disturb" : "Offline")}
            </p>
          </div>
        </div>
        <div>

        <Tooltip
            label="Unfriend"
            placement="top"
            color="white"
            backgroundColor="black"
            fontFamily="UbuntuMedium"
            hasArrow={true}
            arrowSize={10}
            padding={3}
            borderRadius={7}
            openDelay={500}
          >
            <button className='friend-button-remove-friend' onClick={removeFriend}>
              <TbFriendsOff size={35}/>
            </button>
          </Tooltip>

          <Tooltip
            label="Block"
            placement="top"
            color="white"
            backgroundColor="black"
            fontFamily="UbuntuMedium"
            hasArrow={true}
            arrowSize={10}
            padding={3}
            borderRadius={7}
            openDelay={500}
          >
            <button className='friend-button-remove-friend' onClick={blockUser}>
              <BiBlock size={35}/>
            </button>
          </Tooltip>
        </div>
      </div>
    </button>
  );
};



export default FriendButton;