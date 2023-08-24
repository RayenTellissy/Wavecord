import React, { useEffect, useState } from 'react';
import axios from 'axios';

// components
import Role from './Role';

// styles
import "./Roles.css"

const Roles = ({ serverId }) => {
  const [roles,setRoles] = useState([])

  useEffect(() => {
    fetchRoles()
  },[])

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchUsersByRoles/${serverId}`,{
        withCredentials: true
      })
      setRoles(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-roles-bar-container'>
      <div id='server-roles-bar-main-container'>
        {roles.map((e,i) => {
          return <Role key={i} roleName={e.name} roleColor={e.color} users={e.UsersInServers}/>
        })}
      </div>
    </div>
  );
};

export default Roles;