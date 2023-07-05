import React from 'react';

import "./Avatar.css"

const Avatar = ({ image, status }) => {
  return (
    <div id='small-avatar-container'>
      <img id='small-avatar-picture' src={image} />
      {status && <div id='small-avatar-status' 
      style={{ backgroundColor: status === "ONLINE" ? "#24A35B" : (status === "BUSY" ? "#E33B42" : "#A0A0A0")}}/>}
    </div>
  );
};

export default Avatar;