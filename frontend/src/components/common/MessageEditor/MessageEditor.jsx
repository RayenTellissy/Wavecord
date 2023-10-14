import React, { useState } from 'react';

// styles
import "./MessageEditor.css"

const MessageEditor = ({ message, callback, endEditing }) => {
  const [editedMessage,setEditedMessage] = useState(message)

  const edit = () => {
    if(editedMessage === message || !editedMessage) return
    callback(editedMessage)
    endEditing()
  }

  return (
    <div id='message-editor-container'>
      <input id='message-editor-input' value={editedMessage} onChange={e => setEditedMessage(e.target.value)} />
      <div id='message-editor-buttons'>
        <p>escape to <span className='message-editor-action' onClick={endEditing}>cancel</span> • enter to <span className='message-editor-action' onClick={edit}>save</span></p>
      </div>
    </div>
  );
};

export default MessageEditor;