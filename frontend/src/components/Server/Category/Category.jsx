import React, { useState } from 'react';
import { BsPlus } from "react-icons/bs"

// component
import TextChannel from "../TextChannel/TextChannel"
import VoiceChannel from '../VoiceChannel/VoiceChannel';

// styles
import "./Category.css"

const Category = ({
  isAdmin,
  ownerId,
  user,
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
  hoveredVoiceChannelId,
  setHoveredVoiceChannelId,
  removeChannelLocally
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
        {(isAdmin || user.id === ownerId) && <button id='server-category-plus-button' onClick={handleClick}>
          <BsPlus id='server-category-plus-button' size={30}/>
        </button>}
      </div>
      {text.map((e,i) => {
        if(!e.isPrivate || isAdmin){
          return <TextChannel
            key={i}
            id={e.id} 
            name={e.name}
            setCurrentTextChannel={setCurrentTextChannel}
            currentTextChannelId={currentTextChannelId}
            setCurrentTextChannelId={setCurrentTextChannelId}
            hoveredTextChannelId={hoveredTextChannelId}
            setHoveredTextChannelId={setHoveredTextChannelId}
            isAdmin={isAdmin}
            removeChannelLocally={removeChannelLocally}
          />
        }
      })}
      {voice.map((e,i) => {
        if(!e.isPrivate || isAdmin){
          return <VoiceChannel
            key={i}
            id={e.id}
            name={e.name}
            serverId={serverId}
            hoveredVoiceChannelId={hoveredVoiceChannelId}
            setHoveredVoiceChannelId={setHoveredVoiceChannelId}
            isAdmin={isAdmin}
            removeChannelLocally={removeChannelLocally}
          />
        }
      })}
    </div>
  );
};

export default Category;