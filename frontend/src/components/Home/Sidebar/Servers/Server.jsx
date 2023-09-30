import React from 'react';
import { Tooltip } from '@chakra-ui/react';

import "./Server.css"

const Server = ({ id, name, image, highlighted, setCurrentServerId, setDisplay }) => {

  const handleClick = () => {
    setCurrentServerId(id)
    setDisplay("server")
  }

  return <Tooltip label={name}
    placement='right'
    bg="blackAlpha.900"
    color="white"
    padding={3}
    hasArrow={true}
    arrowSize={10}
    margin={5}
    fontFamily="GibsonMedium"
  >
    <button className='home-server-button' onClick={handleClick}>
      <img
        className={highlighted ? (id === highlighted ? 'home-server-image-active' : 'home-server-image') : 'home-server-image'}
        src={image}
      />
    </button>
  </Tooltip>
};

export default Server;