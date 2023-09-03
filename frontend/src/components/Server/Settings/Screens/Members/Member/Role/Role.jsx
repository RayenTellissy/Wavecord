import React from 'react';
import axios from 'axios';

// styles
import "./Role.css"

const Role = ({ id, name, color, userId, onClose, serverId, fetchMembers }) => {

  const giveRole = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/giveRole`,{
        userId,
        roleId: id,
        serverId
      })
      await fetchMembers()
      onClose()
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <button id='server-settings-members-member-roles-popover-container' onClick={giveRole}>
      <div style={{ height: 20, width: 20, backgroundColor: color, borderRadius: '50%'}} />
      <p id='server-settings-members-member-roles-popover-role-name'>{ name }</p>
    </button>
  );
};

export default Role;