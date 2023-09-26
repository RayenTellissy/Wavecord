import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom"
import { Tooltip } from "@chakra-ui/react"
import Cookies from "js-cookie"

// components
import { Context } from '../../../Context/Context';

// styles
import "./Notification.css"

const Notification = ({ conversationId, id, username, image, status, messages }) => {
  const { setConversationChosen } = useContext(Context)
  const navigate = useNavigate()

  const handleClick = () => {
    setConversationChosen({ id, username, image, status })
    Cookies.set("conversationChosen", { id, username, image, status })
    navigate(`/dm/${conversationId}`)
  }

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
      <button id='notification-dm-button' onClick={handleClick}>
        <img id='notification-dm-image' src={image} />
        <div id='notification-dm-messages'>
          { messages }
        </div>
      </button>
    </Tooltip>
  );
};

export default Notification;