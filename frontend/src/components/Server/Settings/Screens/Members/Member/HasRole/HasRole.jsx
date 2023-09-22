import React, { useContext, useState } from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5"

// components
import { Context } from '../../../../../../Context/Context';

// styles
import "./HasRole.css"

const HasRole = ({ userId, serverId, name, color, fetchMembers }) => {
  const { socket } = useContext(Context)
  const [hovered,setHovered] = useState(false)
  const [isLoading,setIsLoading] = useState(false)

  const removeRole = async () => {
    try {
      setIsLoading(true)
      socket.emit("server_member_role_updated", {
        id: userId,
        serverId
      })
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/servers/removeRoleFromUser`,{
        userId,
        serverId
      })
      await fetchMembers()
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <button id='server-settings-members-member-hasrole'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={removeRole}
    >
      {hovered ? <IoClose size={13} color={color}/> : <>
        <div style={{ height: 13, width: 13, borderRadius: "50%", backgroundColor: color }} /></>}
        <p id='server-settings-members-member-hasrole-name'>{isLoading ? 'Loading...' : `${ name }`}</p>
    </button>
  );
};

export default HasRole;