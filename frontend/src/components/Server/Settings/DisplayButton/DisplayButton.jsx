import React from 'react';

// styles
import "./DisplayButton.css"

const DisplayButton = ({ display, callback }) => {
  return (
    <button id='server-settings-display-button' onClick={callback}>
      <p>{ display }</p>
    </button>
  );
};

export default DisplayButton;