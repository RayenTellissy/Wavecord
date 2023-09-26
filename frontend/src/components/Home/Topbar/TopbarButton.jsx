import React from 'react';

const TopbarButton = ({ text, selectedScreen, setSelectedScreen, notifications }) => {

  return <button 
      className={text === selectedScreen ? 'home-right-topbar-friends-button-selected' : 'home-right-topbar-friends-button'}
      onClick={() => setSelectedScreen(text)}
    >
    {text}
    {notifications && <div id='home-right-topbar-pending-number'>
      { notifications }
    </div>}
  </button>
}

export default TopbarButton;