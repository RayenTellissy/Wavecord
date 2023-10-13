import React from 'react';

// components
import DeleteButton from './DeleteButton/Deletebutton';

// styles
import "./MessageUtils.css"
import EditButton from './EditButton/EditButton';

const MessageUtils = ({ hovered, deleteMessage, editMessage }) => {
  return (
    <>
      {hovered && <div id='dm-message-util-buttons'>
        <EditButton callback={editMessage} />
        <DeleteButton callback={deleteMessage}/>
      </div>}
    </>
  );
};

export default MessageUtils;