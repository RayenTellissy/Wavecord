import React, { useEffect, useRef, useState } from 'react';

// styles
import "./MessageEditor.css"

const MessageEditor = ({ message, callback, endEditing }) => {
  const [editedMessage,setEditedMessage] = useState(message)
  const editedMessageRef = useRef(editedMessage)

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)
    return () => document.removeEventListener("keydown", handleKeyPress)
  }, [])

  useEffect(() => {
    editedMessageRef.current = editedMessage
  }, [editedMessage])

  const edit = () => {
    if(editedMessageRef.current === message || !editedMessageRef.current) return
    callback(editedMessageRef.current)
    endEditing()
  }

  const handleKeyPress = (e) => {
    if(e.key === "Enter"){
      return edit()
    }
    if(e.key === "Escape"){
      return endEditing()
    }
  }

  return (
    <div id='message-editor-container'>
      <input
        id='message-editor-input'
        value={editedMessage}
        onChange={e => setEditedMessage(e.target.value)}
        autoFocus
        autoComplete="off"
      />
      <div id='message-editor-buttons'>
        <p>escape to <span className='message-editor-action' onClick={endEditing}>cancel</span> • enter to <span className='message-editor-action' onClick={edit}>save</span></p>
      </div>
    </div>
  );
};

export default MessageEditor;