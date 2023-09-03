import React, { useState } from 'react';
import axios from 'axios';
import { IoClose } from "react-icons/io5"

// styles
import "./HasRole.css"

const HasRole = ({ userId, serverId, name, color, fetchMembers }) => {
  const [hovered,setHovered] = useState(false)

  const removeRole = async () => {
    try {
      await axios.put(`${import.meta.env.VITE_SERVER_URL}/servers/removeRoleFromUser`,{
        userId,
        serverId
      })
      fetchMembers()
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
        <p id='server-settings-members-member-hasrole-name'>{ name }</p>
    </button>
  );
};

export default HasRole;