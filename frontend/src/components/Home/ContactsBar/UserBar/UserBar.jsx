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
  const { user } = useContext(Context)
  const [username,setUsername] = useState("")
  const [image,setImage] = useState("")
  const [status,setStatus] = useState("")

  useEffect(() => {
    fetchUser()
  },[])

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/fetch/${user.id}`)
      setUsername(response.data.username)
      setImage(response.data.image)
      setStatus(response.data.status)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='home-contacts-userbar-container'>

      <div id='home-contacts-userbar-avatar-section'>

        <Avatar image={image} status={status}/>

        <div id='home-contacts-userbar-avatar-name-status'>
          <p id='home-contacts-userbar-username'>{username}</p>
          <p id='home-contacts-userbar-status'>{status === "ONLINE" ? "Online" : (status === "BUSY" ? "Busy" : "Invisible")}</p>
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