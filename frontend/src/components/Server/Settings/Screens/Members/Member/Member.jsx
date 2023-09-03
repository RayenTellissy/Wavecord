import React, { useEffect, useState } from 'react';
import { BiPlus, BiDotsVerticalRounded, BiSearch } from "react-icons/bi"
import { Popover, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from '@chakra-ui/react';

// components
import Avatar from "../../../../../common/Avatar/Avatar"
import Role from './Role/Role';
import HasRole from './HasRole/HasRole';

// styles
import "./Member.css"

const Member = ({ id, username, image, role, roles, setRoles, constantRoles, serverId, fetchMembers }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [query,setQuery] = useState("")

  useEffect(() => {
    filterRoles()
  },[query])

  const filterRoles = () => {
    setRoles(constantRoles.filter(e => e.name.toUpperCase().includes(query.toUpperCase())))
  }

  return (
    <div id='server-settings-members-member-container'>
      <div id='server-settings-members-member-avatar'>
        <Avatar image={image} />
        <p
          style={role ? {color: role.color, fontFamily: "UbuntuRegular"} : {color: "white", fontFamily: "UbuntuRegular"}}
        >
          { username }
        </p>
      </div>
      <div id='server-settings-members-member-add-button-container'>
        {role ? <HasRole id={id} serverId={serverId} name={role.name} color={role.color} fetchMembers={fetchMembers}/> : <Popover isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <button onClick={onOpen} style={{ padding: 5, backgroundColor: '#232428', borderRadius: 7 }}>
              <BiPlus id='server-settings-members-member-add-icon' size={20}/>
            </button>
          </PopoverTrigger>
          <PopoverContent bg="#313338" w={280}>
            <PopoverBody>
              <div>
                <div id='server-settings-members-member-search-container'>
                  <input
                    id='server-settings-members-member-roles-search'
                    placeholder='Role'
                    onChange={e => setQuery(e.target.value)}
                  />
                  <BiSearch id='server-settings-members-member-role-search-icon' size={25}/>
                </div>
                <div id='server-settings-members-member-roles-mapping'>
                  {roles.map((e,i) => {
                    return <Role
                      key={i}
                      id={e.id}
                      name={e.name}
                      color={e.color}
                      userId={id}
                      onClose={onClose}
                      serverId={serverId}
                      fetchMembers={fetchMembers}
                    />
                  })}
                </div>
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>}
      </div>
      <div id='server-settings-members-member-dots-container'>
        <BiDotsVerticalRounded size={25}/>
      </div>
    </div>
  );
};

export default Member;