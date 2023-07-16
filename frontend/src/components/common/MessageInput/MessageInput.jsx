import React, { useState } from 'react';
import { BsEmojiSmileFill } from "react-icons/bs"

import Emoji from '../Emoji/Emoji';

// styles
import "./MessageInput.css"

const MessageInput = ({ conversationName, message, setMessage, sendMessage }) => {
  const [showEmoji,setShowEmoji] = useState(false)

  return (
    <>
    {showEmoji && <Emoji onEmojiClick={emoji => setMessage(prevMessage => `${prevMessage}${emoji.emoji}`)}/>}
      <button id='message-input-emoji-picker' onClick={() => setShowEmoji(!showEmoji)}>
        <BsEmojiSmileFill size={35}/>
      </button>
      <input id='dm-conversation-input'
        type='text'
        spellCheck={false}
        placeholder={`Message @${conversationName}`}
        onChange={e => setMessage(e.target.value)}
        value={message}
        onKeyDown={e => {
          e.key === "Enter" && sendMessage()
        }}
        autoFocus
      />
    </>
  );
};

export default MessageInput;