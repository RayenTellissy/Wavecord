import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { BiSearch } from 'react-icons/bi';

// components
import BannedUser from './BannedUser/BannedUser';
import { Context } from '../../../../Context/Context';

// styles
import "./Bans.css"

const Bans = ({ server }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [constantUsers,setConstantUsers] = useState([])
  const [query,setQuery] = useState("")

  useEffect(() => {
    fetchUsers()
  },[])

  useEffect(() => {
    filterUsers()
  },[query])

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchBannedUsers/${server.id}`, {
        withCredentials: true
      })
      setUsers(response.data)
      setConstantUsers(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const filterUsers = () => {
    setUsers(constantUsers.filter(e => e.user.username.toUpperCase().includes(query.toUpperCase())))
  }

  return (
    <div id='server-settings-bans-container'>
      <p id='server-settings-bans-title'>Server Bans</p>
      <div id='server-settings-bans-search-container'>
        <input
          id='server-settings-bans-search-input'
          placeholder='Search'
          onChange={e => setQuery(e.target.value)}
          autoComplete='off'
        />
        <BiSearch id='server-settings-members-search-input-icon' size={25}/>
      </div>
      <div id='server-settings-bans-banned-users-container'>
        {users.map((e,i) => {
          return <BannedUser
            key={i}
            id={e.user.id}
            username={e.user.username}
            image={e.user.image}
            user={user}
            serverId={server.id}
            fetchUsers={fetchUsers}
          />
        })}
      </div>
    </div>
  );
};

export default Bans;