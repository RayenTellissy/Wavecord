import React, { useContext } from 'react';
import { Tooltip } from '@chakra-ui/react';

// components
import Logo from "../../../common/Logo/Logo"
import { Context } from '../../../Context/Context';

// styles
import "./HomeButton.css"

const HomeButton = ({ setSelected }) => {
  const { setDisplay, setCurrentConversationId, setCurrentServerId } = useContext(Context)

  const handleClick = () => {
    setDisplay("home")
    setCurrentConversationId("")
    setCurrentServerId("")
    setSelected("Friends")
  }

  return <Tooltip label="Home"
    placement='right'
    bg="blackAlpha.900"
    color="white"
    padding={3}
    hasArrow={true}
    arrowSize={10}
    margin={5}
    fontFamily="GibsonMedium"
  >
    <button id='home-button' onClick={handleClick}>
      <Logo  style={{ height: "85%", margin: "auto" }} />
    </button>
  </Tooltip>
};

export default HomeButton;