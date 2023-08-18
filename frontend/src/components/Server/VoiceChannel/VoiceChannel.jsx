import React from 'react';
import { HiSpeakerWave } from "react-icons/hi2"

// styles
import "./VoiceChannel.css"

const VoiceChannel = ({ id, name }) => {
  return (
    <button id='server-voice-channel-button'>
      <HiSpeakerWave id='server-voice-channel-speaker'/>
      <p id='server-voice-channel-name'>{ name }</p>
    </button>
  );
};

export default VoiceChannel;