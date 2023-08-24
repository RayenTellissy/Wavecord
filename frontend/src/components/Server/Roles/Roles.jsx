import React, { useEffect, useState } from 'react';
import axios from 'axios';

// components
import Role from './Role';
import Avatar from '../../common/Avatar/Avatar';

// styles
import "./Roles.css"

const Roles = ({ serverId }) => {
  const [roles,setRoles] = useState([])
  const [noRoles,setNoRoles] = useState([])

  useEffect(() => {
    fetchRoles()
  },[])

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchUsersByRoles/${serverId}`,{
        withCredentials: true
      })
      setRoles(response.data.withRole)
      setNoRoles(response.data.noRole)
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
        <div id='one-role-main-container'>
          <p id='one-role-name'>ONLINE - {noRoles.length}</p>
          {noRoles.map((e,i) => {
            return <button key={i} id='one-role-container'>
              <Avatar status={e.user.status} />
              <p style={{color: "#82929c", fontFamily: "UbuntuMedium"}}>{e.user.username}</p>
            </button>
          })}
        </div>
      </div>
    </div>
  );
};

export default Roles;