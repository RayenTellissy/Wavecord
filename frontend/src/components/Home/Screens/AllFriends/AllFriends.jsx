import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@chakra-ui/react';

// components
import { Context } from '../../../Context/Context';
import FriendButton from '../../../common/FriendButton/FriendButton';
import Loader from '../../../common/Loader/Loader';

// styles
import "./AllFriends.css"

const AllFriends = ({ query, setShowSearch }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [constantUsers,setConstantUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [isUpdating,setIsUpdating] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchUsers()
  },[])

  useEffect(() => {
    filterUsers()
  },[query])

  const fetchUsers = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchAllFriends`,{
        id: user.id
      })
      setUsers(response.data)
      setConstantUsers(response.data)
      
      if(response.data.length !== 0){ 
        setShowSearch(true)
      }
      if(response.data.length === 0 && query === ""){
        setShowSearch(false)
      }
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const filterUsers = () => {
    setUsers(constantUsers.filter(e => e.users[0].username.toUpperCase().includes(query.toUpperCase())))
  }

  return (
    <div id='home-right-display-all-container'>
      {isLoading && <Loader/>}
      {!isLoading && <p id='home-right-display-all-count'>ALL FRIENDS - {users.length}</p>}
      <div id='home-right-display-all-users-container'>
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
            conversationId={e.conversation ? e.conversation.id : null}
          />
        })}
        {isUpdating && <Loader/>}
      </div>
    </div>
  );
};

export default AllFriends;