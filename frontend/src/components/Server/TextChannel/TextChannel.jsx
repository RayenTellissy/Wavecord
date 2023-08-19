import React from 'react';
import { FaHashtag } from "react-icons/fa"

// styles
import "./TextChannel.css"

const TextChannel = ({ id, name, setCurrentTextChannel, setCurrentTextChannelId }) => {

  const handleClick = () => {
    setCurrentTextChannel(name)
    setCurrentTextChannelId(id)
  }

  return (
    <button id='server-text-channel-button' onClick={handleClick}>
      <FaHashtag id='server-text-channel-hashtag'/>
      <p id='server-text-channel-name'>{ name }</p>
    </button>
  );
};

export default TextChannel;