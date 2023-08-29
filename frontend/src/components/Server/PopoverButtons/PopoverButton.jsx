import React from 'react';

// styles
import "./PopoverButton.css"

const PopoverButton = ({ hovered, setHovered, text, textColor, icon }) => {

  return (
    <button className={textColor === "red" ? 'server-popover-button-delete' : 'server-popover-button'}
      onMouseEnter={() => setHovered(text)}
      onMouseLeave={() => setHovered("")}
    >
      <p
        className='server-popover-button-text'
        id={hovered === text ? "server-popover-button-hovered-text" : (textColor === "blue"
        ? 'server-popover-button-invite-text'
        : (textColor === "red" ? 'server-popover-button-delete-text'
        : 'server-popover-button-basic-text'))}
      >
        { text }
      </p>
      { icon }
    </button>
  );
};

export default PopoverButton;