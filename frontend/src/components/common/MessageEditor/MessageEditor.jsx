import React, { useState } from 'react';

const MessageEditor = ({ message, callback }) => {
  const [editedMessage,setEditedMessage] = useState(message)

  const edit = () => {
    if(editedMessage === message) return
    callback(editedMessage)
  }

  return (
    <div>
      <input value={editedMessage} onChange={e => setEditedMessage(e.target.value)} />
      <button onClick={edit}>edit</button>
    </div>
  );
};

export default MessageEditor;