import React from 'react';
import { BsCameraVideoFill, BsCameraVideoOffFill } from "react-icons/bs"
import { MdScreenShare, MdStopScreenShare } from "react-icons/md"
import { Tooltip } from '@chakra-ui/react';

// styles
import "./ToolButton.css"

const ToolButton = ({ tool, callback, screenShareEnabled, cameraEnabled }) => {
  return (
    <Tooltip
      label={tool === "Camera"
      ? (!cameraEnabled ? `Turn On ${tool}` : `Turn Off ${tool}` )
      : (!screenShareEnabled ? "Share Your Screen": "Turn off Screen Share")}
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
        {tool === "Camera" ? (!cameraEnabled ? <BsCameraVideoFill size={20}/> : <BsCameraVideoOffFill size={20} />)
        : (!screenShareEnabled ? <MdScreenShare size={25}/> : <MdStopScreenShare size={25} />)}
      </button>
    </Tooltip>
  );
};

export default ToolButton;