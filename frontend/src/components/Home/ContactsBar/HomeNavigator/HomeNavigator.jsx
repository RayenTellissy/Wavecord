import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./HomeNavigator.css"

const HomeNavigator = ({ selected, setSelected, icon, text, style }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate("/", {
      state: text
    })
    setSelected(text)
  }

  return (
    <button 
      id={text === selected ? 'home-navigator-button-selected' : "home-navigator-button"}
      style={{ ...style }}
      onClick={handleClick}
    >
      <FontAwesomeIcon className='home-navigator-icon' icon={icon}/>
      {text}
    </button>
  )
  
};

export default HomeNavigator;