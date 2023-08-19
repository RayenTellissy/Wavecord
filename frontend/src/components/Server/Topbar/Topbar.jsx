import React from 'react';
import { FaHashtag } from "react-icons/fa"

// styles
import "./Topbar.css"

const Topbar = ({ currentTextChannel }) => {
  return (
    <div id='server-topbar-container'>
      <div id='server-topbar-content'>
        <FaHashtag size={40} color='#80818a'/>
        <p id='server-topbar-channel-name'>{currentTextChannel}</p>
      </div>
    </div>
  );
};

export default Topbar;