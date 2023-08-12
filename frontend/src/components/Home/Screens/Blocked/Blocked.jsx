import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import { Context } from "../../../Context/Context"
import BlockedUser from './BlockedUser';
import Loader from "../../../common/Loader/Loader"

// styles
import "./Blocked.css"

const Blocked = ({ setShowSearch }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    fetchBlocks()
  },[])

  const fetchBlocks = async () => {
    setIsLoading(true)
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/fetchBlocks/${user.id}`,{
        withCredentials: true
      })
      setUsers(response.data)
      if(response.data.length !== 0){
        setShowSearch(true)
      }
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-right-display-blocked-container'>
      <div id='home-right-display-blocked-users'>
        {!isLoading && <p id='home-right-display-blocked-count'>BLOCKED - { users.length }</p>}
        {users.map((e,i) => {
          return <BlockedUser
            key={i}
            username={e.blocked.username} 
            image={e.blocked.image} 
            status={e.blocked.status}
          />
        })}
        {isLoading && <Loader/>}
      </div>
    </div>
  );
};

export default Blocked;