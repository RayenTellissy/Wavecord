import React, { useContext, useState } from 'react';
import axios from "axios"
import moment from "moment/moment"
import { Tooltip } from "@chakra-ui/react"

// components
import Avatar from '../common/Avatar/Avatar';
import { Context } from '../Context/Context';
import MessageUtils from './MessageUtils/MessageUtils';
import MessageEditor from '../common/MessageEditor/MessageEditor';

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
  removeMessageLocally,
  usernameColor,
  conversation
}) => {
  const [hovered,setHovered] = useState(false)
  const [isDeleting,setIsDeleting] = useState(false)
  const [isEditing,setIsEditing] = useState(false)
  const { socket } = useContext(Context)

  const deleteMessage = async () => {
    try {
      socket.emit("delete_message", {
        messageId: id,
        conversation
      })
      setIsDeleting(true)
      if (conversationType === "dm") {
        await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/deleteMessage`, {
          senderId,
          messageId: id
        }, {
          withCredentials: true
        })
        return removeMessageLocally(id)
      }
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/servers/deleteMessage`, {
        senderId,
        messageId: id
      }, {
        withCredentials: true
      })
      removeMessageLocally(id)
    }
    catch (error) {
      console.log(error)
    }
  }

  const editMessage = async (editedMessage) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/conversations/editMessage`, {
        newMessage: editedMessage,
        messageId: id
      }, {
        withCredentials: true
      })
      console.log(response.data)
    }
    catch(error){
      console.log(error)
    }
  }
  
  return (
    <div id='message-container' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div>
        <Avatar image={image} />
      </div>

      <div id='dm-username-message-container'>
        <div id='dm-username-createdat'>
          <p
            id={isDeleting ? 'dm-message-username-deleting' : 'dm-message-username'}
            style={{ color: usernameColor ? usernameColor : "white" }}
          >
            { username }
          </p>
          <Tooltip label={moment(created_at).format('dddd, MMMM Do YYYY, h:mm A')}
            placement='top'
            bg="black"
            color="#DDDEE9"
            hasArrow={true}
            arrowSize={10}
            openDelay={500}
            padding={2}
            borderRadius={5}
            fontFamily="GibsonRegular"
          >
            <p id='dm-message-createdat'>{moment(created_at).calendar()}</p>
          </Tooltip>
        </div>
        {type === "TEXT"
          ?
          (isEditing ? <MessageEditor
              messageId={id}
              message={message}
              callback={editMessage}
            /> : <p id={isDeleting ? 'dm-message-message-deleting' : 'dm-message-message'} className='selectable'>
            { message }
          </p>)
          :
          <a className='dm-message-link' href={message} target="_blank" rel="noopener noreferrer">
            {message}
            <img
              src={message}
              style={isDeleting
                ? { maxWidth: '100%', marginTop: '5px', opacity: "0.2" }
                : { maxWidth: '100%', marginTop: '5px' }
              }
            />
          </a>
        }
      </div>
      {isSender && <MessageUtils
        hovered={hovered}
        deleteMessage={deleteMessage}
        editMessage={setIsEditing}
      />}
    </div>
  );
};

export default Message;