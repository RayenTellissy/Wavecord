import React from 'react';

const TopbarButton = ({ text, selectedScreen, setSelectedScreen }) => {

  return <button 
      className={text === selectedScreen ? 'home-right-topbar-friends-button-selected' : 'home-right-topbar-friends-button'}
      onClick={() => setSelectedScreen(text)}
    >
    {text}
  </button>
}

export default TopbarButton;