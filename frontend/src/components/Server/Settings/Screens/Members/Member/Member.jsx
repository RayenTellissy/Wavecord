import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BiPlus, BiDotsVerticalRounded, BiSearch } from "react-icons/bi"
import { Popover, PopoverBody, PopoverContent, PopoverTrigger, useDisclosure } from '@chakra-ui/react';

// components
import Avatar from "../../../../../common/Avatar/Avatar"
import Role from './Role/Role';
import HasRole from './HasRole/HasRole';
import Loader from "../../../../../common/Loader/Loader"
import ConfirmBanModal from './ConfirmBanModal/ConfirmBanModal';

// styles
import "./Member.css"

const Member = ({
  id,
  username,
  image,
  role,
  roles,
  setRoles,
  constantRoles,
  serverId,
  serverName,
  fetchMembers,
  user,
  isOwner,
  socket,
  modalIsOpen,
  modalOnOpen,
  modalOnClose,
  action,
  setAction
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [query, setQuery] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [isProcessing,setIsProcessing] = useState(false)

  useEffect(() => {
    filterRoles()
  }, [query])

  const filterRoles = () => {
    setRoles(constantRoles.filter(e => e.name.toUpperCase().includes(query.toUpperCase())))
  }

  const kickUser = async () => {
    try {
      setIsProcessing(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/kickUser`, {
        kicker: user.id,
        kicked: id,
        serverId
      }, {
        withCredentials: true
      })
      socket.emit("server_kick_user", {
        userId: id,
        serverId,
        serverName
      })
      await fetchMembers()
      setIsProcessing(false)
      modalOnClose()
    }
    catch (error) {
      console.log(error)
    }
  }

  const banUser = async (reason) => {
    try {
      setIsProcessing(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/banUser`, {
        banner: user.id,
        banned: id,
        serverId,
        reason
      }, {
        withCredentials: true
      })
      socket.emit("server_ban_user", {
        userId: id,
        serverId,
        serverName,
        reason
      })
      await fetchMembers()
      setIsProcessing(false)
      modalOnClose()
    }
    catch (error) {
      console.log(error)
    }
  }

  const openBanModal = () => {
    setAction("ban")
    modalOnOpen()
  }

  const openKickModal = () => {
    setAction("kick")
    modalOnOpen()
  }

  return (
    <div id='server-settings-members-member-container'>
      <ConfirmBanModal
        action={action}
        setAction={setAction}
        isOpen={modalIsOpen}
        onClose={modalOnClose}
        username={username}
        isProcessing={isProcessing}
        banUser={banUser}
        kickUser={kickUser}
      />
      <div id='server-settings-members-member-avatar'>
        <Avatar image={image} />
        <p
          style={role ? { color: role.color, fontFamily: "GibsonRegular" } : { color: "white", fontFamily: "GibsonRegular" }}
        >
          {username}
        </p>
      </div>
      <div id='server-settings-members-member-add-button-container'>
        {role ? <HasRole
          userId={id}
          serverId={serverId}
          name={role.name}
          color={role.color}
          fetchMembers={fetchMembers}
        />
          : <Popover isOpen={isOpen} onClose={onClose}>
            <PopoverTrigger>
              <button onClick={onOpen} style={{ padding: 5, backgroundColor: '#232428', borderRadius: 7 }}>
                <BiPlus id='server-settings-members-member-add-icon' size={20} />
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
                      autoComplete='off'
                    />
                    <BiSearch id='server-settings-members-member-role-search-icon' size={25} />
                  </div>
                  <div id='server-settings-members-member-roles-mapping'>
                    {isLoading ? (<Loader />) :
                      (roles.map((e, i) => {
                        return <Role
                          key={i}
                          id={e.id}
                          name={e.name}
                          color={e.color}
                          userId={id}
                          onClose={onClose}
                          serverId={serverId}
                          fetchMembers={fetchMembers}
                          setIsLoading={setIsLoading}
                        />
                      }))}
                  </div>
                </div>
              </PopoverBody>
            </PopoverContent>
          </Popover>}
      </div>
      <div id='server-settings-members-member-dots-container'>
        <Popover>
          <PopoverTrigger>
            <button>
              <BiDotsVerticalRounded size={25} />
            </button>
          </PopoverTrigger>
          <PopoverContent bg="#111214" w={220}>
            <PopoverBody>
              {!role?.isAdmin && !isOwner && <>
                <button className='server-settings-members-member-dots-red-button' onClick={openKickModal}>
                  Kick {username}
                </button>
                <button className='server-settings-members-member-dots-red-button' onClick={openBanModal}>
                  Ban {username}
                </button>
              </>}
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default Member;