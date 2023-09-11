import React from 'react';

// styles
import "./UserInRoom.css"

const UserInRoom = ({ id, username, image, isMicrophoneEnabled, deafened, isSpeaking, screenShareEnabled, cameraEnabled }) => {

  return (
    <>
      {username && <div id='user-in-room-container'>
        <img id='user-in-room-image' src={image} />
        <p id='user-in-room-name'>{ username }</p>
      </div>}
    </>
  );
};

export default UserInRoom;