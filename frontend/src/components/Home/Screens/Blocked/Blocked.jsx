import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import { Context } from "../../../Context/Context"
import BlockedUser from './BlockedUser';
import Loader from "../../../common/Loader/Loader"

// styles
import "./Blocked.css"

const Blocked = ({ query, setShowSearch }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [isUnblocking,setIsUnblocking] = useState(false)


  useEffect(() => {
    fetchBlocks()
    return () => setShowSearch(false)
  },[])

  useEffect(() => {
    filterUsers()
  },[query])

  const filterUsers = () => {
    if(!query){
      fetchBlocks()
    }
    setUsers(users.filter(e => e.blocked.username.toLowerCase().includes(query.toLowerCase())))
  }

  const fetchBlocks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/fetchBlocks/${user.id}`,{
        withCredentials: true
      })
      setUsers(response.data)
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

  return (
    <div id='home-right-display-blocked-container'>
      <div id='home-right-display-blocked-users'>
        {!isLoading && <p id='home-right-display-blocked-count'>BLOCKED - { users.length }</p>}
        {users.map((e,i) => {
          return <BlockedUser
            key={i}
            id={e.blocked.id}
            username={e.blocked.username} 
            image={e.blocked.image} 
            status={e.blocked.status}
            setIsUnblocking={setIsUnblocking}
            fetchBlocks={fetchBlocks}
          />
        })}
        {isLoading && <Loader/>}
        {isUnblocking && <Loader/>}
      </div>
    </div>
  );
};

export default Blocked;