import React from 'react';
import { LuZap } from "react-icons/lu"

// styles
import "./TurboButton.css"

const TurboButton = ({ text, callback }) => {
  return (
    <button id='turbo-subscribe-button' onClick={callback}>
      <LuZap size={21} />
      { text }
    </button>
  );
};

export default TurboButton;