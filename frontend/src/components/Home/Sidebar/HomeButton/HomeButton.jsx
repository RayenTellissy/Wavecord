import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom"

import Logo from "../../../common/Logo/Logo"

// styles
import "./HomeButton.css"

const HomeButton = () => {
  const navigate = useNavigate()
  
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
    <button id='home-button' onClick={() => navigate("/")}>
      <Logo style={{ height: "85%", margin: "auto"}}/>
    </button>
  </Tooltip> 
};

export default HomeButton;