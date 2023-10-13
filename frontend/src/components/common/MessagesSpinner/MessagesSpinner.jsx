import React from 'react';
import { LuLoader2 } from 'react-icons/lu';

// styles
import "./MessagesSpinner.css"

const MessagesSpinner = () => {
  return (
    <div id='messages-spinner-container'>
      <LuLoader2 id='messages-spinner-spinner' size={35} />
      Loading messages
    </div>
  );
};

export default MessagesSpinner;