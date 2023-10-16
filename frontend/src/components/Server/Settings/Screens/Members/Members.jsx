import React, { useContext, useEffect, useState } from 'react';
import axios from "axios"
import { BiSearch } from "react-icons/bi"
import BeatLoader from 'react-spinners/BeatLoader';
import { useDisclosure } from '@chakra-ui/react';

// components
import Member from './Member/Member';
import { Context } from "../../../../Context/Context"

// styles
import "./Members.css"

const Members = ({ server }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, socket } = useContext(Context)
  const [users, setUsers] = useState([])
  const [constantUsers, setConstantUsers] = useState([])
  const [roles,setRoles] = useState([])
  const [constantRoles,setConstantRoles] = useState([])
  const [query,setQuery] = useState("")
  const [isLoading,setIsLoading] = useState(true)
  const [action,setAction] = useState(null)

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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchMembers/${server.id}`, {
        withCredentials: true
      })
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
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchOnlyRoles/${server.id}`, {
        withCredentials: true
      })
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
      <div id='server-settings-members-header'>
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
      </div>
      <div id='server-settings-members-mapping' className='default-scrollbar'>
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
            serverName={server.name}
            fetchMembers={fetchMembers}
            user={user}
            isOwner={e.user.servers_created.length !== 0}
            socket={socket}
            modalIsOpen={isOpen}
            modalOnOpen={onOpen}
            modalOnClose={onClose}
            action={action}
            setAction={setAction}
          />
        })}
        {isLoading && <BeatLoader size={8} color='white'/>}
      </div>
    </div>
  );
};

export default Members;