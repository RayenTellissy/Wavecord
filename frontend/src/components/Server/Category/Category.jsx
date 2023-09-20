import React, { useState } from 'react';
import { BsPlus } from "react-icons/bs"

// component
import TextChannel from "../TextChannel/TextChannel"
import VoiceChannel from '../VoiceChannel/VoiceChannel';

// styles
import "./Category.css"

const Category = ({
  isAdmin,
  id,
  name,
  text,
  voice,
  onOpen,
  serverId,
  setCategoryChosen,
  setCategoryIdChosen,
  setCurrentTextChannel,
  currentTextChannelId,
  setCurrentTextChannelId,
  hoveredTextChannelId,
  setHoveredTextChannelId,
  setCurrentChannelType,
  hoveredVoiceChannelId,
  setHoveredVoiceChannelId
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
        {isAdmin && <button id='server-category-plus-button' onClick={handleClick}>
          <BsPlus id='server-category-plus-button' size={30}/>
        </button>}
      </div>
      {text.map((e,i) => {
        return <TextChannel 
          key={i}
          id={e.id} 
          name={e.name} 
          setCurrentTextChannel={setCurrentTextChannel}
          currentTextChannelId={currentTextChannelId}
          setCurrentTextChannelId={setCurrentTextChannelId}
          hoveredTextChannelId={hoveredTextChannelId}
          setHoveredTextChannelId={setHoveredTextChannelId}
        />
      })}
      {voice.map((e,i) => {
        return <VoiceChannel
          key={i}
          id={e.id}
          name={e.name}
          serverId={serverId}
          setCurrentChannelType={setCurrentChannelType}
          hoveredVoiceChannelId={hoveredVoiceChannelId}
          setHoveredVoiceChannelId={setHoveredVoiceChannelId}
        />
      })}
    </div>
  );
};

export default Category;