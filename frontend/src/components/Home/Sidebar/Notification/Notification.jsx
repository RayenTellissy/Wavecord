import React, { useContext } from 'react';
import { Tooltip } from "@chakra-ui/react"
import Cookies from "js-cookie"

// components
import { Context } from '../../../Context/Context';

// styles
import "./Notification.css"

const Notification = ({ conversationId, id, username, image, status, messages }) => {
  const { 
    setConversationChosen,
    setCurrentConversationId,
    setDisplay,
    setCurrentServerId,
    directMessageNotifications,
    setDirectMessageNotifications
  } = useContext(Context)

  const handleClick = () => {
    setConversationChosen({ id, username, image, status })
    Cookies.set("conversationChosen", JSON.stringify({ id, username, image, status }))
    setCurrentConversationId(conversationId)
    setCurrentServerId("")
    setDisplay("directMessages")
    // deleting the notification we clicked on
    const notificationsCopy = directMessageNotifications
    delete notificationsCopy[conversationId]
    setDirectMessageNotifications(notificationsCopy)
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