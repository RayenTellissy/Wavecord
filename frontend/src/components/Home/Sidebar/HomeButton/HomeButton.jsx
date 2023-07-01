import React from 'react';
import { Tooltip } from '@chakra-ui/react';

import Logo from "../../../common/Logo/Logo"

// styles
import "./HomeButton.css"

const HomeButton = () => {
  return <Tooltip label="Home"
    placement='right' 
    bg="blackAlpha.900" 
    color="white"
    padding={3}
    hasArrow={true}
    arrowSize={10}
    margin={5}
    fontFamily="UbuntuMedium"
    >
    <button id='home-button'>
      <Logo style={{ height: "85%", margin: "auto"}}/>
    </button>
  </Tooltip> 
};

export default HomeButton;