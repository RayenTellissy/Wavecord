import React, { useState } from 'react';
import axios from 'axios';
import { FiUserX } from "react-icons/fi"
import BeatLoader from "react-spinners/BeatLoader"

// components
import Avatar from "../../../../../common/Avatar/Avatar"

// styles
import "./BannedUser.css"

const BannedUser = ({ id, username, image, user, serverId, fetchUsers }) => {
  const [isLoading,setIsLoading] = useState(false)

  const unbanUser = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/unbanUser`,{
        remover: user.id,
        removed: id,
        serverId
      })
      await fetchUsers()
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-settings-bans-banned-user'>
      <div id='server-settings-bans-avatar-container'>
        <Avatar image={image}/>
        <p>{ username }</p>
      </div>
      <button id='server-settings-bans-unban-button' onClick={unbanUser}>
        {isLoading ? <BeatLoader color='white' size={10}/> : <FiUserX size={30}/>}
      </button>
    </div>
  );
};

export default BannedUser;