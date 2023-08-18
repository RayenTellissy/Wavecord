import React, { useState } from 'react';
import { BsPlus } from "react-icons/bs"

// component
import TextChannel from "../TextChannel/TextChannel"
import VoiceChannel from '../VoiceChannel/VoiceChannel';

// styles
import "./Category.css"

const Category = ({ id, name, text, voice, setShowModal, setCategoryChosen }) => {
  const [hovered,setHovered] = useState(false)

  const handleClick = () => {
    setCategoryChosen(name)
    setShowModal(true)
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
        return <TextChannel key={i} id={e.id} name={e.name}/>
      })}
      {voice.map((e,i) => {
        return <VoiceChannel key={i} id={e.id} name={e.name}/>
      })}
    </div>
  );
};

export default Category;