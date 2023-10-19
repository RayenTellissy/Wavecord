import React from 'react';
import { FaHashtag } from "react-icons/fa"
import { IoIosSettings } from "react-icons/io"
import { Tooltip, useDisclosure } from "@chakra-ui/react"

// styles
import "./TextChannel.css"
import EditChannelModal from '../EditChannelModal/EditChannelModal';

const TextChannel = ({
  id,
  name,
  setCurrentTextChannel,
  currentTextChannelId,
  setCurrentTextChannelId,
  hoveredTextChannelId,
  setHoveredTextChannelId,
  isAdmin,
  removeChannelLocally,
  renameChannelLocally
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleClick = () => {
    setCurrentTextChannel(name)
    setCurrentTextChannelId(id)
  }

  const handleActive = (boolean) => {
    if(currentTextChannelId === id) return
    if(boolean){
      return setHoveredTextChannelId(id)
    }
    setHoveredTextChannelId("")
  }

  const openModal = (e) => {
    e.stopPropagation()
    onOpen()
  }

  return (
    <div
      id={currentTextChannelId === id ? 'server-text-channel-connected' : 'server-text-channel-button'}
      onClick={handleClick}
      onMouseEnter={() => handleActive(true)}
      onMouseLeave={() => handleActive(false)}
    >
      <div id='server-text-channel-info'>
        <FaHashtag id='server-text-channel-hashtag'/>
        <p
          id={currentTextChannelId === id || hoveredTextChannelId === id
          ? 'server-text-channel-name-active'
          : 'server-text-channel-name'}
        >
          { name }
        </p>
      </div>
      {isAdmin && (
        <>
          {(currentTextChannelId === id || hoveredTextChannelId === id) && (
            <Tooltip
              label="Edit Channel"
              placement='top'
              color="white"
              backgroundColor="black"
              fontFamily="GibsonRegular"
              hasArrow={true}
              arrowSize={10}
              padding="7px 13px"
              borderRadius={7}
            >
              <button onClick={openModal}>
                <IoIosSettings size={18} color='#949ba4'/>
              </button>
            </Tooltip>
          )}
          <EditChannelModal
            channelType="text"
            isOpen={isOpen}
            onClose={onClose}
            id={id}
            name={name}
            removeChannelLocally={removeChannelLocally}
            renameChannelLocally={renameChannelLocally}
          />
        </>
      )}
    </div>
  );
};

export default TextChannel;