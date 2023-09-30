import React, { useContext } from 'react';
import axios from 'axios';

// components
import { Context } from '../../../../../../Context/Context';

// styles
import "./Role.css"

const Role = ({ id, name, color, userId, onClose, serverId, fetchMembers, setIsLoading }) => {
  const { socket } = useContext(Context)

  const giveRole = async () => {
    try {
      setIsLoading(true)
      socket.emit("server_member_role_updated", {
        id: userId,
        serverId
      })
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/giveRole`, {
        userId,
        roleId: id,
        serverId
      }, {
        withCredentials: true
      })
      await fetchMembers()
      onClose()
      setIsLoading(false)
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