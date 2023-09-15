import React, { useState } from 'react';
import axios from "axios"
import moment from "moment/moment"
import { Tooltip } from "@chakra-ui/react"
import { BiSolidTrash } from "react-icons/bi"

// components
import Avatar from '../common/Avatar/Avatar';

import "./Messages.css"

const Message = ({
  id,
  isSender,
  senderId,
  username,
  image,
  message,
  type,
  created_at,
  conversationType,
  removeMessageLocally
}) => {
  const [isDeleting,setIsDeleting] = useState(false)

  const deleteMessage = async () => {
    try {
      setIsDeleting(true)
      if(conversationType === "dm"){
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/deleteMessage`,{
          senderId,
          messageId: id
        })
        return removeMessageLocally(id)
      }
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/deleteMessage`, {
        senderId,
        messageId: id
      })
      removeMessageLocally(id)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='message-container'>
      <div>
        <Avatar image={image} />
      </div>

      <div id='dm-username-message-container'>
        <div id='dm-username-createdat'>
          <p id={isDeleting ? 'dm-message-username-deleting' : 'dm-message-username'}>{username}</p>
          <Tooltip label={moment(created_at).format('dddd, MMMM Do YYYY, h:mm A')}
            placement='top'
            bg="black"
            color="#DDDEE9"
            hasArrow={true}
            arrowSize={10}
            openDelay={500}
            padding={2}
            borderRadius={5}
          >
            <p id='dm-message-createdat'>{moment(created_at).calendar()}</p>
          </Tooltip>
        </div>
        {type === "TEXT"
        ?
        <p id={isDeleting ? 'dm-message-message-deleting' : 'dm-message-message'} className='selectable'>{message}</p>
        :
        <a className='dm-message-link' href={message} target="_blank" rel="noopener noreferrer">
          {message}
          <img
            src={message}
            style={isDeleting
            ? { maxWidth: '100%', marginTop: '5px', opacity: "0.2" }
            : { maxWidth: '100%', marginTop: '5px'}
          }
          />
        </a>
        }
      </div>
      {isSender && <Tooltip
        label="Delete Message"
        placement='top'
        color="white"
        backgroundColor="black"
        hasArrow={true}
        arrowSize={3}
        padding={3}
        borderRadius={7}
        openDelay={500}
        fontFamily="UbuntuMedium"
      >
        <div id='dm-message-remove-button' onClick={deleteMessage}>
          <BiSolidTrash color='#da373c' size={25}/>
        </div>
      </Tooltip>}
    </div>
  );
};

export default Message;