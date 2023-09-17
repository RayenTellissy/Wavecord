import React from 'react';
import { FaHashtag } from "react-icons/fa"

// styles
import "./TextChannel.css"

const TextChannel = ({
  id,
  name,
  setCurrentTextChannel,
  currentTextChannelId,
  setCurrentTextChannelId,
  hoveredTextChannelId,
  setHoveredTextChannelId
}) => {

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

  return (
    <button
      id='server-text-channel-button'
      onClick={handleClick}
      onMouseEnter={() => handleActive(true)}
      onMouseLeave={() => handleActive(false)}
    >
      <FaHashtag id='server-text-channel-hashtag'/>
      <p
        id={currentTextChannelId === id || hoveredTextChannelId === id
        ? 'server-text-channel-name-active'
        : 'server-text-channel-name'}
      >
        { name }
      </p>
    </button>
  );
};

export default TextChannel;