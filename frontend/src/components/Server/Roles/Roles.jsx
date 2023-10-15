import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import Role from './Role';
import Avatar from '../../common/Avatar/Avatar';
import { Context } from '../../Context/Context';

// helper functions
import updateUserStatusInServer from '../../../utils/Helper/updateUserStatusInServer';

// styles
import "./Roles.css"

const Roles = ({ serverId }) => {
  const { user, socket, status } = useContext(Context)
  const [roles,setRoles] = useState([])
  const [noRoles,setNoRoles] = useState([])
  const [offline,setOffline] = useState([])

  useEffect(() => {
    fetchRoles()
  }, [serverId])

  useEffect(() => {
    updateUserStatusInServer(user.id, status, roles, noRoles, setRoles, setNoRoles)
  }, [status])

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
  }, [socket])

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchUsersByRoles/${serverId}`, {
        withCredentials: true
      })
      setRoles(response.data.withRole)
      setNoRoles(response.data.noRole)
      setOffline(response.data.offline)
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
          {offline.length !== 0 && <p className='one-role-name' id='one-role-offline-name'>OFFLINE - { offline.length }</p>}
          {offline.map((e, i) => {
            return <button key={i} className='one-role-offline'>
              <Avatar status={e.user.status} />
              <p style={e.role ? { color: e.role.color } : { color: '#a6aeb3' }}>{e.user.username}</p>
            </button>
          })}
        </div>
      </div>
    </div>
  );
};

export default Roles;