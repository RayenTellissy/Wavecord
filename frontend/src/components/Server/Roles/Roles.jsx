import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import Role from './Role';
import Avatar from '../../common/Avatar/Avatar';
import { Context } from '../../Context/Context';

// styles
import "./Roles.css"

const Roles = ({ serverId }) => {
  const { socket } = useContext(Context)
  const [roles,setRoles] = useState([])
  const [noRoles,setNoRoles] = useState([])
  const [offline,setOffline] = useState([])

  useEffect(() => {
    fetchRoles()
  },[serverId])

  useEffect(() => {
    socket.on("receive_member_status", () => {
      fetchRoles()
    })
    socket.on("receive_member_role_updated", () => {
      fetchRoles()
    })
    return () => {
      socket.off("receive_member_status")
      socket.off("server_member_role_updated")
    }
  },[socket])

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchUsersByRoles/${serverId}`)
      setRoles(response.data.withRole)
      setNoRoles(response.data.noRole)
      setOffline(response.data.offline)
      console.log(roles)
    }
    catch(error) {
      console.log(error)
    }
  }

  return (
    <div id='server-roles-bar-container' className='default-scrollbar'>
      <div id='server-roles-bar-main-container'>
        {roles.map((e, i) => {
          return <Role key={i} roleName={e.name} roleColor={e.color} users={e.UsersInServers} />
        })}
        <div className='one-role-main-container'>
          {noRoles.length !== 0 && <p className='one-role-name'>ONLINE - { noRoles.length }</p>}
          {noRoles.map((e, i) => {
            return <button key={i} className='one-role-container'>
              <Avatar status={e.user.status} />
              <p className='one-role-username'>{e.user.username}</p>
            </button>
          })}
          {offline.length !== 0 && <p className='one-role-name'>OFFLINE - { offline.length }</p>}
          {offline.map((e, i) => {
            return <button key={i} className='one-role-offline'>
              <Avatar status={e.user.status} />
              <p style={e.role ? { color: e.role.color } : { color: '#a6aeb3'}}>{e.user.username}</p>
            </button>
          })}
        </div>
      </div>
    </div>
  );
};

export default Roles;