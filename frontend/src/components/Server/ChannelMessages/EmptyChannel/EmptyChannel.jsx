import React from 'react';
import { FaHashtag } from "react-icons/fa"

// styles
import "./EmptyChannel.css"

const EmptyChannel = ({ channelName }) => {
  return (
    <div id='empty-channel-container'>
      <div id='empty-channel-welcome-div'>
        <FaHashtag size={55}/>
        <p id='empty-channel-welcome-text'>Welcome to #{ channelName }!</p>
      </div>
      <p id='empty-channel-start-text'>This is the start of the #{ channelName } channel.</p>
    </div>
  );
};

export default EmptyChannel;