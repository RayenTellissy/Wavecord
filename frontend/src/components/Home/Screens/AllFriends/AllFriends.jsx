import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import { Context } from '../../../Context/Context';
import FriendButton from '../../../common/FriendButton/FriendButton';
import Loader from '../../../common/Loader/Loader';

// styles
import "./AllFriends.css"

const AllFriends = ({ query, setShowSearch }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    fetchAllFriends()
    return () => setShowSearch(false)
  },[query])

  const fetchAllFriends = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchAllFriends`,{
        id: user.id,
        query: query
      },{
        withCredentials: true
      })
      setUsers(response.data)
      if(response.data.length !== 0){ 
        setShowSearch(true)
      }
      if(response.data.length === 0){
        setShowSearch(false)
      }
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-right-display-all-container'>
      {isLoading && <Loader/>}
      {!isLoading && <p id='home-right-display-all-count'>ALL FRIENDS - {users.length}</p>}
      {users.map((e,i) => {
        return <FriendButton
          key={i}
          username={e.users[0].username}
          image={e.users[0].image}
          status={e.users[0].status}
        />
      })}
    </div>
  );
};

export default AllFriends;