import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from "js-cookie"
import {
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody
} from "@chakra-ui/react"
import { IoIosArrowDown } from "react-icons/io"
import { MdClose } from "react-icons/md"
import useSound from 'use-sound';

// components
import Category from './Category/Category';
import ChannelMessages from './ChannelMessages/ChannelMessages';
import Userbar from "../Home/ContactsBar/UserBar/UserBar"
import AllButtons from './PopoverButtons/AllButtons';
import ServerLink from './ServerLinkModal/ServerLink';
import { Context } from '../Context/Context';
import VoiceRoom from './VoiceRoom/VoiceRoom';
import SimpleLoader from "../common/SimpleLoader/SimpleLoader"
import CreateChannel from "./CreateChannel/CreateChannel"

// styles
import "./Server.css"

// helper functions
import { applyMemorization, memorizeTextChannel } from "../../utils/Helper/memorizeTextChannel"

// sounds
import JoinRoom from "../../assets/sounds/JoinRoom.mp3"
import LeaveRoom from "../../assets/sounds/LeaveRoom.mp3"
import VerificationBadge from '../common/VerificationBadge/VerificationBadge';

const Server = () => {
  const { 
    user,
    socket,
    displayRoom,
    setDisplayRoom,
    currentVoiceChannelId,
    currentServerId
  } = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isOpenDropdown, onOpen: onOpenDropdown, onClose: onCloseDropdown } = useDisclosure()
  const { isOpen: isOpenServerLink, onOpen: onOpenServerLink, onClose: onCloseServerLink } = useDisclosure()
  const [server,setServer] = useState({})
  const [currentTextChannel,setCurrentTextChannel] = useState("")
  const [currentTextChannelId,setCurrentTextChannelId] = useState("")
  const [hoveredTextChannelId,setHoveredTextChannelId] = useState("")
  const [hoveredVoiceChannelId,setHoveredVoiceChannelId] = useState("")
  const [categoryChosen,setCategoryChosen] = useState("")
  const [categoryIdChosen,setCategoryIdChosen] = useState("")
  const [showDropdown,setShowDropdown] = useState(false)
  const [isFetching,setIsFetching] = useState(null)
  const [role,setRole] = useState({})
  const [playJoin] = useSound(JoinRoom, { volume: 0.2 })
  const [playLeave] = useSound(LeaveRoom, { volume: 0.1 })

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => handleUnload(e))
    socket.emit("open_server", currentServerId)
    applyMemorization(currentServerId, setCurrentTextChannelId, setCurrentTextChannel) // text channel memo
    fetchData()
    return () => {
      setDisplayRoom(false)
      window.removeEventListener("beforeunload", handleUnload)
    }
  },[currentServerId])

  useEffect(() => {
    handleDefaultChannel()
  },[server])

  useEffect(() => {
    if(!currentVoiceChannelId){
      Cookies.remove("cachedVoiceChannel")
    }
    else {
      Cookies.set("cachedVoiceChannel", currentVoiceChannelId)
    }
  },[currentVoiceChannelId])

  useEffect(() => {
    memorizeTextChannel(currentServerId,currentTextChannelId,currentTextChannel)
  },[currentTextChannelId])
  
  const fetchData = async () => {
    try {
      setIsFetching(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/fetch`,{
        serverId: currentServerId,
        userId: user.id
      }, {
        withCredentials: true
      })
      setServer(response.data.server)
      setRole(response.data.role)
      setIsFetching(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const handlePopoverOpen = () => {
    setShowDropdown(true)
    onOpenDropdown()
  }

  const handlePopoverClose = () => {
    setShowDropdown(false)
    onCloseDropdown()
  }

  // leaves voice room before unloading app
  const handleUnload = () => {
    const cachedVoiceChannel = Cookies.get("cachedVoiceChannel")
    if(cachedVoiceChannel){
      socket.emit("leave_voice", {
        serverId: currentServerId,
        channelId: cachedVoiceChannel,
        userId: user.id
      })
      fetch(`${import.meta.env.VITE_SERVER_URL}/servers/leaveVoiceRoom`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: user.id
        }),
        keepalive: true,
        credentials: "include"
      })
    }
  }

  // this functions sets the current channel to the last channel visited by the user (saved in storage)
  const handleDefaultChannel = () => {
    if(!currentTextChannelId && server.categories && server.categories[0].Text_channels){
      const channel = server.categories[0].Text_channels[0]
      setCurrentTextChannelId(channel.id)
      setCurrentTextChannel(channel.name)
    }
  }

  const removeChannelLocally = (channelType, channelId) => {
    if(channelType === "text"){
      const categoryIndex = server.categories.findIndex(category => {
        return category.Text_channels.some(channel => channel.id === channelId)
      })
    
      const textChannelIndex = server.categories[categoryIndex].Text_channels.findIndex(channel => {
        return channel.id === channelId
      })

      setServer(prevServer => ({
        ...prevServer,
        categories: server.categories.map(category => {
            const textChannels = category.Text_channels.filter((channel, index) => index !== textChannelIndex)
            return { ...category, Text_channels: textChannels }
        })
      }))
    }
    else if(channelType === "voice"){
      const categoryIndex = server.categories.findIndex(category => {
        return category.Voice_channels.some(channel => channel.id === channelId)
      })
    
      const voiceChannelIndex = server.categories[categoryIndex].Voice_channels.findIndex(channel => {
        return channel.id === channelId
      })

      setServer(prevServer => ({
        ...prevServer,
        categories: server.categories.map(category => {
            const voiceChannels = category.Voice_channels.filter((channel, index) => index !== voiceChannelIndex)
            return { ...category, Voice_channels: voiceChannels }
        })
      }))
    }
  }

  const renameChannelLocally = (channelType, channelId, newName) => {
    if(channelType === "text"){
      setServer(prevServer => ({
        ...prevServer,
        categories: prevServer.categories.map(category => {
          const updatedTextChannels = category.Text_channels.map(channel => {
            if(channelId === channel.id){
              return { ...channel, name: newName }
            }
            return channel
          })
          return { ...category, Text_channels: updatedTextChannels }
        })
      }))
    }
    else if(channelType === "voice"){
      setServer(prevServer => ({
        ...prevServer,
        categories: prevServer.categories.map(category => {
          const updatedVoiceChannels = category.Voice_channels.map(channel => {
            if(channelId === channel.id){
              return { ...channel, name: newName }
            }
            return channel
          })
          return { ...category, Voice_channels: updatedVoiceChannels }
        })
      }))
    }
  }

  return (
    <div id='server-container'>
      <button id='voice-channel-join-sound-activator' onClick={() => playJoin()}/>
      <button id='voice-channel-leave-sound-activator' onClick={() => playLeave()}/>
      <div id='server-bar-container'>
        <div id='server-bar-main'>
          <Popover
            placement='bottom'
            isOpen={isOpenDropdown}
            onOpen={handlePopoverOpen}
            onClose={handlePopoverClose}
          >
            <PopoverTrigger>
              <button id='server-name-container'>
                <div id='server-popover-name-icon'>
                  {isFetching ? <SimpleLoader /> : <>
                    <p id='server-name'>{server.verified && <VerificationBadge />}
                      {server.name}
                    </p>
                    <div id='server-banner-icon-container'>
                      {showDropdown
                        ? <MdClose size={25}/>
                        : <IoIosArrowDown size={25}/>}
                    </div>
                  </>}
                </div>
              </button>
            </PopoverTrigger>
            <PopoverContent bgColor="#111214" width={280}>
              <PopoverBody>
                {isFetching ? <SimpleLoader /> : <AllButtons
                  ownerId={server.ownerId}
                  onOpen={onOpenServerLink}
                  user={user}
                  server={server}
                  fetchData={fetchData}
                  isAdmin={role ? role.isAdmin : false}
                />}
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <div id='server-category-main-container'>
            {isFetching ? <div id='server-categories-loader'><SimpleLoader /></div> : (
              <>
                {server.categories && server.categories.map((e,i) => {
                  return <Category
                    key={i}
                    isAdmin={role ? role.isAdmin : false}
                    ownerId={server.ownerId}
                    user={user}
                    id={e.id}
                    name={e.name}
                    text={e.Text_channels}
                    voice={e.Voice_channels}
                    onOpen={onOpen}
                    serverId={currentServerId}
                    setCategoryChosen={setCategoryChosen}
                    setCategoryIdChosen={setCategoryIdChosen}
                    setCurrentTextChannel={setCurrentTextChannel}
                    currentTextChannelId={currentTextChannelId}
                    setCurrentTextChannelId={setCurrentTextChannelId}
                    hoveredTextChannelId={hoveredTextChannelId}
                    setHoveredTextChannelId={setHoveredTextChannelId}
                    hoveredVoiceChannelId={hoveredVoiceChannelId}
                    setHoveredVoiceChannelId={setHoveredVoiceChannelId}
                    removeChannelLocally={removeChannelLocally}
                    renameChannelLocally={renameChannelLocally}
                  />
                })}
              </>
            )}
          </div>
          <Userbar/>
        </div>
      </div>
      <div id='server-right-display-content'>
        {!displayRoom && <ChannelMessages
          serverId={currentServerId}
          currentTextChannel={currentTextChannel}
          setCurrentTextChannel={setCurrentTextChannel}
          currentTextChannelId={currentTextChannelId}
          setCurrentTextChannelId={setCurrentTextChannelId}
          roleColor={role ? role.color : "white"}
          server={server}
          fetchServerData={fetchData}
        />}
        {currentVoiceChannelId && <VoiceRoom
          serverId={server.id}
          channelId={currentVoiceChannelId}
        />}
      </div>
      <CreateChannel
        isOpen={isOpen}
        onClose={onClose}
        categoryIdChosen={categoryIdChosen}
        setCategoryIdChosen={setCategoryIdChosen}
        categoryChosen={categoryChosen}
        setCategoryChosen={setCategoryChosen}
        fetchData={fetchData}
        currentServerId={currentServerId}
      />
      <ServerLink
        isOpen={isOpenServerLink}
        onOpen={onOpenServerLink}
        onClose={onCloseServerLink}
        server={server}
        user={user}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Server;