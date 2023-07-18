import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./HomeNavigator.css"

const HomeNavigator = ({ selected, setSelected, icon, text, style }) => {
  return (
    <button 
      id={text === selected ? 'home-navigator-button-selected' : "home-navigator-button"}
      style={{ ...style }}
      onClick={() => setSelected(text)}
    >
      <FontAwesomeIcon className='home-navigator-icon' icon={icon}/>
      {text}
    </button>
  )
  
};

export default HomeNavigator;