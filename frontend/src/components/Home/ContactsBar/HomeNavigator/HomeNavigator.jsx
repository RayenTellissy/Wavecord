import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "./HomeNavigator.css"

const HomeNavigator = ({ icon, text, style }) => {
  return (
    <button 
      id='home-navigator-button'
      style={{ ...style }}>
        
      <FontAwesomeIcon icon={icon} style={{ margin: 15, height: 30, width: 30 }}/>
      
      {text}
    
    </button>
  )
  
};

export default HomeNavigator;