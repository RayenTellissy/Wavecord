import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./HomeNavigator.css"

const HomeNavigator = ({ icon, text, style }) => {
  return (
    <button 
      id='home-navigator-button'
      style={{ ...style }}>
        
      <FontAwesomeIcon className='home-navigator-icon' icon={icon}/>
      
      {text}
    
    </button>
  )
  
};

export default HomeNavigator;