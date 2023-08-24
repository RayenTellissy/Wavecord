import React, { useState } from 'react';

// styles
import "./Roles.css"
import axios from 'axios';

const Roles = ({ serverId }) => {
  const [users,setUsers] = useState([])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchUsersByRoles/${serverId}`,{
        withCredentials: true
      })
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-roles-bar-container'>

    </div>
  );
};

export default Roles;