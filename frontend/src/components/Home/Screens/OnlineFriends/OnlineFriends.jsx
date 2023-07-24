import React, { useContext, useEffect, useState } from 'react';
import axios from "axios"

// components
import { Context } from "../../../Context/Context"
import FriendButton from '../../../common/FriendButton/FriendButton';

// styles
import "./OnlineFriends.css"

const OnlineFriends = ({ query }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])

  useEffect(() => {
    fetchUsers()
  },[])

  const fetchUsers = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchOnlineFriends`,{
        id: user.id,
        query: query
      })
      setUsers(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-right-display-online-container'>
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

export default OnlineFriends;