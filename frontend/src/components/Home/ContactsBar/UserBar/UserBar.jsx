import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMicrophone, faMicrophoneSlash, faHeadset, faGear } from "@fortawesome/free-solid-svg-icons"

// components
import { Context } from '../../../Context/Context';
import Avatar from "../../../common/Avatar/Avatar"

// styles
import "./UserBar.css"

const UserBar = () => {
  const { user, setUser } = useContext(Context)

  useEffect(() => {
    fetchUser()
  },[])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/fetch/${user.id}`,{
        withCredentials: true
      })
      const result = response.data
      const fetched = {
        image: result.image,
        status: result.status
      }
      setUser({ ...user, ...fetched })
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-contacts-userbar-container'>

      <div id='home-contacts-userbar-avatar-section'>

        <Avatar image={user.image} status={user.status}/>

        <div id='home-contacts-userbar-avatar-name-status'>
          <p id='home-contacts-userbar-username'>{user.username}</p>
          <p id='home-contacts-userbar-status'>{user.status === "ONLINE" ? "Online" : (user.status === "BUSY" ? "Busy" : "Invisible")}</p>
        </div>

      </div>

      <div id='home-contacts-userbar-icons-section'>
        <button><FontAwesomeIcon className='home-contacts-userbar-icon' icon={faMicrophone} /></button>
        <button><FontAwesomeIcon className='home-contacts-userbar-icon' icon={faHeadset} /></button>
        <button><FontAwesomeIcon className='home-contacts-userbar-icon' icon={faGear} /></button>
      </div>
        


    </div>
  );
};

export default UserBar;