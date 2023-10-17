import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import { Context } from "../../../Context/Context"
import BlockedUser from './BlockedUser';
import UsersLoader from '../../../common/UsersLoader/UsersLoader';

// styles
import "./Blocked.css"

const Blocked = ({ query, setShowSearch }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [constantUsers,setConstantUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    fetchBlocks()
    return () => setShowSearch(false)
  },[])

  useEffect(() => {
    filterUsers()
  },[query])

  const filterUsers = () => {
    setUsers(constantUsers.filter(e => e.blocked.username.toLowerCase().includes(query.toLowerCase())))
  }

  const fetchBlocks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/fetchBlocks/${user.id}`,{
        withCredentials: true
      })
      setUsers(response.data)
      setConstantUsers(response.data)
      if(response.data.length !== 0){
        setShowSearch(true)
      }
      else if(response.data.length === 0){
        setShowSearch(false)
      }
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  if(isLoading){
    return <UsersLoader text="Loading blocks" />
  }

  return (
    <div id='home-right-display-blocked-container'>
      <div id='home-right-display-blocked-users'>
        <p id='home-right-display-blocked-count'>BLOCKED - { users.length }</p>
        <div id='home-right-display-blocked-users-container' className='default-scrollbar'>
          {users.map((e,i) => {
            return <BlockedUser
              key={i}
              id={e.blocked.id}
              username={e.blocked.username} 
              image={e.blocked.image} 
              status={e.blocked.status}
              fetchBlocks={fetchBlocks}
            />
          })}
        </div>
        </div>
    </div>
  );
};

export default Blocked;