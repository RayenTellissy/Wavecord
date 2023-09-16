import React from 'react';
import { Tooltip } from "@chakra-ui/react"

import "./Avatar.css"

const Avatar = ({ image, status }) => {
  return (
    <div id='small-avatar-container'>
      <img id='small-avatar-picture' src={image} />
      {status && <Tooltip label={status === "ONLINE" ? "Online" : (status === "BUSY" ? "Do Not Disturb" : "Offline")}
        placement='top'
        bg="blackAlpha.900"
        color="white"
        padding={3}
        hasArrow={true}
        arrowSize={10}
        borderRadius={7}
        margin={1}
        fontFamily="GibsonMedium"
      >
        <div id='small-avatar-status'
          style={{ backgroundColor: status === "ONLINE" ? "#24A35B" : (status === "BUSY" ? "#E33B42" : "#A0A0A0") }} />
      </Tooltip>}
    </div>
  );
};

export default Avatar;