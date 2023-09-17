import React, { useContext, useEffect, useState } from 'react';
import axios from "axios"
import { BiSearch } from "react-icons/bi"
import BeatLoader from 'react-spinners/BeatLoader';

// components
import Member from './Member/Member';
import { Context } from "../../../../Context/Context"

// styles
import "./Members.css"

const Members = ({ server }) => {
  const { user } = useContext(Context)
  const [users, setUsers] = useState([])
  const [constantUsers, setConstantUsers] = useState([])
  const [roles,setRoles] = useState([])
  const [constantRoles,setConstantRoles] = useState([])
  const [query,setQuery] = useState("")
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    fetchData()
  },[])

  useEffect(() => {
    filterUsers()
  },[query])

  const fetchData = async () => {
    await fetchMembers()
    fetchRoles()
  }

  const fetchMembers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchMembers/${server.id}`)
      setUsers(response.data)
      setConstantUsers(response.data)
      setIsLoading(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchOnlyRoles/${server.id}`)
      setRoles(response.data)
      setConstantRoles(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  const filterUsers = () => {
    setUsers(constantUsers.filter(e => e.user.username.toUpperCase().includes(query.toUpperCase())))
  }

  return (
    <div id='server-settings-members-container'>
      <p id='server-settings-members-title'>Server Members</p>
      {!isLoading && <div id='server-settings-members-count-input-container'>
        <p id='server-settings-members-count'>{constantUsers.length} Members</p>
        <div id='server-settings-members-search-container'>
          <input
            id='server-settings-members-search-input'
            placeholder='Search'
            onChange={e => setQuery(e.target.value)}
            autoComplete='off'
          />
          <BiSearch id='server-settings-members-search-input-icon' size={25}/>
        </div>
      </div>}
      <div id='server-settings-members-mapping'>
        {users.map((e,i) => {
          return <Member
            key={i}
            id={e.user.id}
            username={e.user.username}
            image={e.user.image}
            role={e.role}
            roles={roles}
            setRoles={setRoles}
            constantRoles={constantRoles}
            serverId={server.id}
            fetchMembers={fetchMembers}
            user={user}
          />
        })}
        {isLoading && <BeatLoader size={8} color='white'/>}
      </div>
    </div>
  );
};

export default Members;