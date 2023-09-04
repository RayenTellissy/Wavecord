import React, { useContext, useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMicrophone, faMicrophoneSlash, faHeadset, faGear } from "@fortawesome/free-solid-svg-icons"
import axios from 'axios';

// components
import Avatar from "../../../common/Avatar/Avatar"
import { Context } from '../../../Context/Context';

// styles
import "./UserBar.css"

const UserBar = () => {
  const { user } = useContext(Context)
  const [userData,setUserData] = useState({})

  useEffect(() => {
    fetchUser()
  },[])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/fetchUserbar/${user.id}`)
      setUserData(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-contacts-userbar-container'>

      <div id='home-contacts-userbar-avatar-section'>

        <Avatar image={userData.image} status={userData.status}/>

        <div id='home-contacts-userbar-avatar-name-status'>
          <p id='home-contacts-userbar-username'>{userData.username}</p>
          <p id='home-contacts-userbar-status'>{userData.status === "ONLINE" ? "Online" : (userData.status === "BUSY" ? "Busy" : "Invisible")}</p>
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