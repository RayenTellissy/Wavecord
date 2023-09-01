import React from 'react';

// styles
import "./DisplayButton.css"

const DisplayButton = ({ display, callback, highlighted }) => {
  return (
    <button
      id={highlighted ? 'server-settings-display-button-active' : 'server-settings-display-button'} 
      onClick={callback}
    >
      <p>{ display }</p>
    </button>
  );
};

export default DisplayButton;