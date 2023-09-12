import React, { useState } from 'react';
import { BsPlus } from "react-icons/bs"

// component
import TextChannel from "../TextChannel/TextChannel"
import VoiceChannel from '../VoiceChannel/VoiceChannel';

// styles
import "./Category.css"

const Category = ({
  id,
  name,
  text,
  voice,
  onOpen,
  serverId,
  setCategoryChosen,
  setCategoryIdChosen,
  setCurrentTextChannel,
  setCurrentTextChannelId,
  setCurrentChannelType,
  currentVoiceChannelId,
  setCurrentVoiceChannelId,
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
        return <VoiceChannel
          key={i}
          id={e.id}
          name={e.name}
          serverId={serverId}
          setCurrentChannelType={setCurrentChannelType}
          currentVoiceChannelId={currentVoiceChannelId}
          setCurrentVoiceChannelId={setCurrentVoiceChannelId}
        />
      })}
    </div>
  );
};

export default Category;