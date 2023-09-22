import React from 'react';
import { BsCameraVideoFill } from "react-icons/bs"
import { MdScreenShare } from "react-icons/md"
import { Tooltip } from '@chakra-ui/react';

// styles
import "./ToolButton.css"

const ToolButton = ({ tool, callback }) => {
  return (
    <Tooltip
      label={tool === "Camera" ? `Turn On ${tool}` : "Share Your Screen"}
      placement="top"
      color="#dbdee1"
      backgroundColor="black"
      fontFamily="GibsonMedium"
      hasArrow={true}
      arrowSize={10}
      padding={2.5}
      borderRadius={7}
    >
      <button className='userbar-tool-button' onClick={callback}>
        {tool === "Camera" ? <BsCameraVideoFill size={20}/> : <MdScreenShare size={25}/>}
      </button>
    </Tooltip>
  );
};

export default ToolButton;