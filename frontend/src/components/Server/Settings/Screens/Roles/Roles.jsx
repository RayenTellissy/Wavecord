import React, { useEffect, useState } from 'react';
import { BiSearch } from "react-icons/bi"
import axios from 'axios';
import BeatLoader from "react-spinners/BeatLoader"
import { useDisclosure } from '@chakra-ui/react';

// components
import Role from './Role/Role';
import CreateRole from './CreateRole/CreateRole';

// styles
import "./Roles.css"

const Roles = ({ server }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [query,setQuery] = useState("")
  const [roles,setRoles] = useState([])
  const [constantRoles,setConstantRoles] = useState([])
  const [isLoading,setIsLoading] = useState(true)

  useEffect(() => {
    fetchRoles()
  },[])

  useEffect(() => {
    filterData()
  },[query])

  const fetchRoles = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetchServerRoles/${server.id}`,{
        withCredentials: true
      })
      setRoles(response.data)
      setConstantRoles(response.data)
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const filterData = async () => {
    setRoles(constantRoles.filter(e => e.name.toUpperCase().includes(query.toUpperCase())))
  }

  return (
    <div id='server-settings-roles-container'>
      <p id='server-settings-roles-title'>Roles</p>
      <p id='server-settings-roles-under-title'>Use roles to group your server members and assign permissions.</p>
      <div id='server-settings-roles-search-create-container'>
        <div id='server-settings-roles-search-container'>
          <input
            id='server-settings-roles-search-input'
            type='text'
            placeholder='Search Roles'
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete='off'
          />
          <BiSearch id='server-settings-roles-search-input-search-icon' color='#a4aab0' size={25}/>
        </div>
        <button id='server-settings-roles-create-role' onClick={onOpen}>Create Role</button>
      </div>
      <div id='server-settings-roles-display'>
        <p id='server-settings-roles-number-title'>ROLES - {roles.length}</p>
        <div id='server-settings-roles-display-mapping'>
          {roles.map((e,i) => {
            return <Role
              key={i}
              id={e.id}
              name={e.name}
              color={e.color}
              members={e.UsersInServers.length}
              fetchRoles={fetchRoles}
            />
          })}
          {isLoading && <BeatLoader size={8} color='white'/>}
        </div>
      </div>
      <CreateRole
        isOpen={isOpen}
        onClose={onClose}
        serverId={server.id}
        fetchRoles={fetchRoles}
        setQuery={setQuery}
      />
    </div>
  );
};

export default Roles;