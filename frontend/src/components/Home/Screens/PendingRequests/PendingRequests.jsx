import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import { Context } from "../../../Context/Context"
import Received from './Request/Received';
import Sent from './Request/Sent';
import UsersLoader from '../../../common/UsersLoader/UsersLoader';

// styles
import "./PendingRequests.css"

const PendingRequests = ({ query, setShowSearch }) => {
  const { socket, user, friendRequestNotifications, setFriendRequestNotifications, notificationsEnabled } = useContext(Context)
  const [users,setUsers] = useState([])
  const [constantUsers,setConstantUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    fetchRequests()
    removeFriendRequestNotifications()
    return () => {
      setShowSearch(false)
      removeFriendRequestNotifications()
    }
  },[])

  useEffect(() => {
    if(!notificationsEnabled.friendRequests){
      socket.off("receive_friend_request_notification")
    }
    if(notificationsEnabled.friendRequests){
      socket.on("receive_friend_request_notification", () => {
        fetchRequests()
      })
    }
  },[socket])

  useEffect(() => {
    filterUsers()
  },[query])

  const filterUsers = () => {
    setUsers(constantUsers.filter(e => e.sender.username.toLowerCase().includes(query.toLowerCase())))
  }

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/fetchPending/${user.id}`, {
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

  const removeFriendRequestNotifications = async () => {
    if(friendRequestNotifications){
      try {
        setFriendRequestNotifications(null)
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/notifications/removeFriendRequestNotification`, {
          recipientId: user.id
        }, {
          withCredentials: true
        })
      }
      catch(error){
        console.log(error)
      }
    }
  }

  // this function removes a friend request (used when the user accepts or declines a friend request)
  const updateRequestsLocally = (requestId) => {
    const filteredArray = constantUsers.filter(e => e.id !== requestId)
    setUsers(filteredArray)
    setConstantUsers(filteredArray)
  }

  if(isLoading){
    return <UsersLoader text="Loading requests" />
  }

  return (
    <div id='home-right-display-pending-container'>
      <div id='home-right-display-pending-users'>
        <p id='home-right-display-pending-count'>PENDING - {users.length}</p>
        <div id='home-right-display-pending-users-container' className='default-scrollbar'>
          {users.map((e,i) => {
            if(e.recipient.id === user.id){
              return <Received key={i}
                requestId={e.id}
                id={e.sender.id}
                username={e.sender.username} 
                image={e.sender.image} 
                status={e.sender.status}
                updateRequestsLocally={updateRequestsLocally}                
              />
            }
            else {
              return <Sent key={i}
                requestId={e.id}
                username={e.recipient.username} 
                image={e.recipient.image} 
                status={e.recipient.status} 
                updateRequestsLocally={updateRequestsLocally}                
              />
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default PendingRequests;