import React from 'react';
import { Tooltip } from '@chakra-ui/react';
import { LuPencil } from 'react-icons/lu';

const EditButton = ({ callback }) => {
  return <Tooltip
    label="Edit Message"
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
      <LuPencil color='#b4bac0' size={23} />
    </button>
  </Tooltip>
};

export default EditButton;