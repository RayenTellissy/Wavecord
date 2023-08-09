import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

// components
import { Context } from "../../../Context/Context"
import Received from './Request/Received';
import Sent from './Request/Sent';
import Loader from "../../../common/Loader/Loader"

// styles
import "./PendingRequests.css"

const PendingRequests = ({ setShowSearch }) => {
  const { user } = useContext(Context)
  const [users,setUsers] = useState([])
  const [isLoading,setIsLoading] = useState(true)
  const [isAccepting,setIsAccepting] = useState(false)

  useEffect(() => {
    fetchRequests()
    return () => setShowSearch(false)
  },[])

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/friends/fetchPending/${user.id}`)
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
    <div id='home-right-display-pending-container'>
      <div id='home-right-display-pending-users'>
        {isLoading && <Loader/>}
        {!isLoading && <p id='home-right-display-pending-count'>PENDING - {users.length}</p>}
        {users.map((e,i) => {
          if(e.recipient.id === user.id){
            return <Received key={i}
              id={e.sender.id}
              username={e.sender.username} 
              image={e.sender.image} 
              status={e.sender.status}
              fetchRequests={fetchRequests}
              setIsAccepting={setIsAccepting}
            />
          }
          else {
            return <Sent key={i} username={e.recipient.username} image={e.recipient.image} status={e.recipient.status} />
          }
        })}
        {isAccepting && <Loader/>}
      </div>
    </div>
  );
};

export default PendingRequests;