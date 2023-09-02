import React, { useEffect, useState } from 'react';
import axios from "axios"

// components
import Member from './Member/Member';

// styles
import "./Members.css"

const Members = ({ server }) => {
  const [users, setUsers] = useState([])
  const [constantUsers, setConstantUsers] = useState([])
  const [query,setQuery] = useState("")

  useEffect(() => {
    fetchMembers()
  },[])

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchMembers/${server.id}`, {
        withCredentials: true
      })
      setUsers(response.data)
      setConstantUsers(response.data)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div id='server-settings-members-container'>
      <p id='server-settings-members-title'>Server Members</p>
      <div>
        <p id='server-settings-members-count'>{constantUsers.length} Members</p>
        <input placeholder='Search' />
      </div>
      <div id='server-settings-members-mapping'>
        {users.map((e,i) => {
          return <Member
            key={i}
            id={e.user.id}
            username={e.user.username}
            image={e.user.image}
            role={e.role}
          />
        })}
      </div>
    </div>
  );
};

export default Members;