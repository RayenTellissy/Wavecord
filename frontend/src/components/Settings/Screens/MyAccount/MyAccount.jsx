import React, { useContext, useState } from 'react';
import axios from 'axios';

// components
import { Context } from '../../../Context/Context';

// styles
import "./MyAccount.css"

const MyAccount = () => {
  const { user, status, setUser } = useContext(Context)
  const [emailHidden,setEmailHidden] = useState(true)
  const [newUsername,setNewUsername] = useState("")
  const [password,setPassword] = useState("")

  const hideEmail = (email) => {
    const index = email.indexOf("@")
    
    if(index !== -1){
      const hiddenEmail = email.replace(email.slice(0, index), "*".repeat(index))
      return hiddenEmail
    }

    return email
  }

  const changeUsername = async () => {
    if(!newUsername) return
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/changeUsername`, {
        id: user.id,
        newUsername,
        email: user.email,
        password
      })
    }
    catch(error){
      console.log(error)
    }
  }

  const logout = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`, {
        withCredentials: true
      })
      setUser(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='user-settings-myaccount-container'>
      <button onClick={logout}>log out</button>
      <p id='user-settings-myaccount-title'>My Account</p>
      <div id='user-settings-myaccount-holder'>
        <div id='user-settings-myaccount-username-image-container'>
          <div id='user-settings-myaccount-image-container'>
            <img id='user-settings-myaccount-image' src={user.image} />
            <div id='user-settings-myaccount-status' style={{ backgroundColor: status === "ONLINE" ? "#24A35B" : (status === "BUSY" ? "#E33B42" : "#A0A0A0") }}/>
          </div>
          <p id='user-settings-myaccount-username'>{ user.username }</p>
        </div>
        <div id='user-settings-myaccount-all-information'>
          <div id='user-settings-myaccount-all-information-editor'>
            <div className='user-settings-myaccount-all-information-row'>
              <div>
                <p className='user-settings-myaccount-editor-title'>USERNAME</p>
                <p className='user-settings-myaccount-editor-content'>{ user.username }</p>
              </div>
              <button className='user-settings-myaccount-editor-edit-button'>Edit</button>
            </div>
            <div className='user-settings-myaccount-all-information-row'>
              <div>
                <p className='user-settings-myaccount-editor-title'>EMAIL</p>
                <div id='user-settings-myaccount-editor-email-container'>
                  <p className='user-settings-myaccount-editor-content'>
                    {emailHidden ? hideEmail(user.email) : user.email}
                  </p>
                  <button id='user-settings-myaccount-email-reveal' onClick={() => setEmailHidden(!emailHidden)}>
                    {emailHidden ? "Reveal" : "Hide"}
                  </button>
                </div>
              </div>
              <button className='user-settings-myaccount-editor-edit-button'>Edit</button>
            </div>
          </div>
        </div>
      </div>

      <div className='user-settings-myaccount-seperator'/>

      <div>
        <p>Password and Authentication</p>
      </div>

      <div className='user-settings-myaccount-seperator'/>

      <div>
        <p>ACCOUNT REMOVAL</p>
      </div>

    </div>
  );
};

export default MyAccount;