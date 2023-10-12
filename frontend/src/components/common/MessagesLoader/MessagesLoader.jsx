import React from 'react';
import { LuLoader, LuLoader2 } from "react-icons/lu"

// styles
import "./MessagesLoader.css"

const MessagesLoader = ({ loadMore, isFetching }) => {
  return (
    <div id='messages-loader-container'>
      <button id='messages-loader-button' onClick={loadMore}>
        {isFetching ? <LuLoader2 id='messages-loader-spinner' size={25} /> : "Load previous messages"}
      </button>
    </div>
  );
};

export default MessagesLoader;