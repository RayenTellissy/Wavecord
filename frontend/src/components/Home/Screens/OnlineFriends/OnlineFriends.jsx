import React, { useContext, useEffect, useState } from 'react';
import axios from "axios"
import { useToast } from "@chakra-ui/react"

// components
import { Context } from "../../../Context/Context"
import FriendButton from '../../../common/FriendButton/FriendButton';
import UsersLoader from "../../../common/UsersLoader/UsersLoader"

// styles
import "./OnlineFriends.css"

const OnlineFriends = ({ query, setShowSearch }) => {
  const { user, socket } = useContext(Context)
  const [users,setUsers] = useState([])
  const [constantUsers,setConstantUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [isUpdating,setIsUpdating] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchUsers()
    return () => setShowSearch(false)
  },[])

  useEffect(() => {
    filterUsers()
  },[query])

  useEffect(() => {
    socket.on("receive_update_friend_status", () => {
      fetchUsers()
    })
    return () => socket.off("receive_update_friend_status")
  },[socket])

  const fetchUsers = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/friends/fetchOnlineFriends`,{
        id: user.id
      }, {
        withCredentials: true
      })
      setUsers(response.data)
      setConstantUsers(response.data)
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

  const filterUsers = () => {
    setUsers(constantUsers.filter(e => e.users[0].username.toUpperCase().includes(query.toUpperCase())))
  }

  if(isLoading){
    return <UsersLoader text="Loading users" />
  }

  return (
    <div id='home-right-display-online-container'>
      <p id='home-right-display-online-count'>ONLINE - {users.length}</p>
      <div id='home-right-display-online-users-container' className='default-scrollbar'>
        {users.map((e,i) => {
          return <FriendButton
            key={i}
            id={e.users[0].id}
            username={e.users[0].username}
            image={e.users[0].image}
            status={e.users[0].status}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            fetchUsers={fetchUsers}
            toast={toast}
            conversationId={e.conversation ? e.conversation.id : null}
          />
        })}
      </div>
    </div>
  );
};

export default OnlineFriends;