import React from 'react';

import Logo from "../../../common/Logo/Logo"

// styles
import "./HomeButton.css"

const HomeButton = () => {
  return <button id='home-button'>
    <Logo style={{ height: "85%", margin: "auto"}}/>
  </button>
};

export default HomeButton;