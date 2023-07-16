import React from 'react';
import EmojiPicker from 'emoji-picker-react';

const Emoji = ({ onEmojiClick }) => {
  return (
    <div>
      <EmojiPicker emojiStyle='twitter' theme='dark' onEmojiClick={onEmojiClick}/>
    </div>
  );
};

export default Emoji;