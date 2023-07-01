import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

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

        </div>

      </div>

    </div>
  );
};

export default UserBar;