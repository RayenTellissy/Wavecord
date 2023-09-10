import React, { useState } from 'react';
import { BsPlus } from "react-icons/bs"

// component
import TextChannel from "../TextChannel/TextChannel"
import VoiceChannel from '../VoiceChannel/VoiceChannel';

// styles
import "./Category.css"
import { LiveKitRoom, VideoConference } from '@livekit/components-react';

const Category = ({
  id,
  name,
  text,
  voice,
  onOpen,
  setCategoryChosen,
  setCategoryIdChosen,
  setCurrentTextChannel,
  setCurrentTextChannelId,
  setCurrentChannelType,
  setCurrentVoiceChannelId,
  voiceTokens
}) => {
  const [hovered,setHovered] = useState(false)

  const handleClick = () => {
    setCategoryChosen(name)
    setCategoryIdChosen(id)
    onOpen()
  }

  return (
    <div id='server-category-container' >
      <div 
        id='server-category-row-container'
        onMouseEnter={() => setHovered(true)} 
        onMouseLeave={() => setHovered(false)}
      >
        <p 
          className='server-category-name' 
          id={hovered ? 'server-category-name-hovered' : 'server-category-name-unhovered'}
        >
          {name}
        </p>
        <button id='server-category-plus-button' onClick={handleClick}>
          <BsPlus id='server-category-plus-button' size={30}/>
        </button>
      </div>
      {text.map((e,i) => {
        return <TextChannel 
          key={i}
          id={e.id} 
          name={e.name} 
          setCurrentTextChannel={setCurrentTextChannel}
          setCurrentTextChannelId={setCurrentTextChannelId}
        />
      })}
      {voice.map((e,i) => {
        return <LiveKitRoom
          serverUrl={import.meta.env.VITE_LIVEKIT_PUBLIC_URL}
          token={voiceTokens[e.id]}
          connect={true}
          audio={true}
        >
          <VoiceChannel
            key={i}
            id={e.id}
            name={e.name}
            setCurrentChannelType={setCurrentChannelType}
            setCurrentVoiceChannelId={setCurrentVoiceChannelId}
            token={voiceTokens[e.id]}
          />
        </LiveKitRoom>
      })}
    </div>
  );
};

export default Category;