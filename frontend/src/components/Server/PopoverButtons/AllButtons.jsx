import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BsFillPersonPlusFill } from "react-icons/bs"
import { MdSettings } from "react-icons/md"
import { BiSolidFolderPlus } from "react-icons/bi"
import { RiDoorOpenLine } from "react-icons/ri"
import { IoIosRemoveCircle } from "react-icons/io"
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalFooter, useDisclosure, ModalHeader } from "@chakra-ui/react"
import BeatLoader from 'react-spinners/BeatLoader';

// components
import PopoverButton from './PopoverButton';

// styles
import "./AllButtons.css"

const AllButtons = ({ user, ownerId, onOpen, server }) => {
  const { isOpen, onOpen: onOpenConfirmation, onClose } = useDisclosure()
  const [hovered,setHovered] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [query,setQuery] = useState("")
  const navigate = useNavigate()

  const leaveServer = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/leaveServer`,{
        userId: user.id,
        serverId: server.id
      })
      navigate("/")
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const deleteServer = async () => {
    try {
      setIsLoading(true)
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/deleteServer`, {
        ownerId: user.id,
        serverId: server.id
      })
      navigate("/")
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  const launchConfirmation = () => {
    onOpenConfirmation()
  }

  return (
    <div>
      <PopoverButton
        hovered={hovered}
        setHovered={setHovered}
        text="Invite People"
        textColor="blue"
        icon={<BsFillPersonPlusFill size={20} color={hovered === "Invite People" ? 'white' : '#949cf7'}/>}
        callback={() => onOpen()}
      />
      {user.id === ownerId && <>
        <PopoverButton
          hovered={hovered}
          setHovered={setHovered}
          text="Server Settings"
          icon={<MdSettings size={20}/>}
          callback={() => navigate(`/server/settings`,{
            state: server
          })}
        />
        <PopoverButton
          hovered={hovered}
          setHovered={setHovered}
          text="Create Category"
          icon={<BiSolidFolderPlus size={20}/>}
        />
      </>}
      <PopoverButton
        hovered={hovered}
        setHovered={setHovered}
        text={user.id === ownerId ? "Delete Server" : "Leave Server"}
        textColor="red"
        icon={user.id === ownerId
          ? <IoIosRemoveCircle color={hovered === "Delete Server" ? "white" : '#da373c'} size={20}/>
          : <RiDoorOpenLine color={hovered === "Leave Server" ? "white" : '#da373c'} size={20}
        />}
        callback={launchConfirmation}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent bgColor="#313338">
          {ownerId !== user.id ? 
          <>
            <ModalHeader borderTopRadius={3}>
              <p id='server-leaving-confirmation-header'>Leave '{ server.name }'</p>
            </ModalHeader>
            <ModalBody marginBottom={3}>
              <h4 id='server-leaving-confirmation-text'>Are you sure you want to leave <span id='server-leaving-confirmation-server-name'>{ server.name }</span>?
              </h4>
            </ModalBody>
            <ModalFooter bgColor="#2b2d31" h={75} borderBottomRadius={3}>
              <button id='server-leaving-confirmation-cancel-button' onClick={() => onClose()}>Cancel</button>
              <button id='server-leaving-confirmation-leave-button' onClick={() => leaveServer()}>
                {isLoading ? <BeatLoader size={10} color='white'/> : "Leave Server"}
              </button>
            </ModalFooter>
          </> :
          <>
          <ModalBody>
            Write the server's name to confirm
            <p>{ server.name }</p>
            <input value={query} onChange={e => setQuery(e.target.value)} />
          </ModalBody>
          </>}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AllButtons;