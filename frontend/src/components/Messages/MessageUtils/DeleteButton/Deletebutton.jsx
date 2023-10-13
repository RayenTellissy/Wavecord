import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { LuTrash } from "react-icons/lu"

const DeleteButton = ({ callback }) => {
  return <Tooltip
    label="Delete Message"
    placement='top'
    color="white"
    backgroundColor="black"
    hasArrow={true}
    arrowSize={3}
    padding={3}
    borderRadius={7}
    openDelay={500}
    fontFamily="GibsonMedium"
  >
    <button onClick={callback}>
      <LuTrash color='#da373c' size={23} />
    </button>
  </Tooltip>
};

export default DeleteButton;