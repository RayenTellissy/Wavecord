import React from 'react';
import { useNavigate } from "react-router-dom"
import { Tooltip } from "@chakra-ui/react"

// styles
import "./Notification.css"

const Notification = ({ conversationId, username, image, messages }) => {
  const navigate = useNavigate()

  return (
    <Tooltip label={username}
      placement='right'
      bg="blackAlpha.900"
      color="white"
      padding={3}
      hasArrow={true}
      arrowSize={10}
      margin={5}
      fontFamily="GibsonMedium"
    >
      <button id='notification-dm-button' onClick={() => navigate(`/dm/${conversationId}`)}>
        <img id='notification-dm-image' src={image} />
        <div id='notification-dm-messages'>
          { messages }
        </div>
      </button>
    </Tooltip>
  );
};

export default Notification;