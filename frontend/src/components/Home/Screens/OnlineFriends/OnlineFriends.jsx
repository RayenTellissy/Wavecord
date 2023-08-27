import React, { useContext, useEffect, useState } from 'react';
import axios from "axios"
import { useToast } from "@chakra-ui/react"

// components
import { Context } from "../../../Context/Context"
import FriendButton from '../../../common/FriendButton/FriendButton';
import Loader from '../../../common/Loader/Loader';

// styles
import "./OnlineFriends.css"

const OnlineFriends = ({ query, setShowSearch }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [isUpdating,setIsUpdating] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchUsers()
  },[query])

  const fetchUsers = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchOnlineFriends`,{
        id: user.id,
        query: query
      },{
        withCredentials: true
      })
      setUsers(response.data)
      if(response.data.length !== 0) {
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
    <div id='home-right-display-online-container'>
      {isLoading && <Loader/>}
      {!isLoading && <p id='home-right-display-online-count'>ONLINE - {users.length}</p>}
      <div id='home-right-display-online-users-container'>
        {users.map((e,i) => {
          return <FriendButton
            key={i}
            id={e.users[0].id}
            username={e.users[0].username}
            image={e.users[0].image}
            status={e.users[0].status}
            setIsUpdating={setIsUpdating}
            fetchUsers={fetchUsers}
            toast={toast}
          />
        })}
        {isUpdating && <Loader/>}
      </div>
    </div>
  );
};

export default OnlineFriends;