import React, { useContext } from 'react';
import { AiOutlineAudioMuted } from "react-icons/ai"
import { BsCameraVideoFill } from "react-icons/bs"

// components
import Live from '../../../common/Live/Live';
import { Context } from '../../../Context/Context';

// styles
import "./UserInRoom.css"

const UserInRoom = ({
  id,
  username,
  image,
  deafened,
  userMicEnabled,
  userSpeaking,
  userScreenShareEnabled,
  userCameraEnabled
}) => {
  const { user, micEnabled, cameraEnabled, isSpeaking, screenShareEnabled } = useContext(Context)

  return (
    <>
      {username && <div id='user-in-room-container'>
        <div id='user-in-room-name-container'>
          {user.id !== id
          ? <img id={userSpeaking ? 'user-in-room-image-speaking' : 'user-in-room-image'} src={image} />
          : <img id={isSpeaking ? 'user-in-room-image-speaking' : 'user-in-room-image'} src={image} />}
          <p id='user-in-room-name'>{ username }</p>
        </div>
        <div id='user-in-room-icons'>
          {user.id !== id ? <>
            {userScreenShareEnabled && <Live/>}
            {userCameraEnabled && <BsCameraVideoFill className='user-in-room-icon' size={20}/>}
            {!userMicEnabled && <AiOutlineAudioMuted className='user-in-room-icon' size={20}/>}
          </> : <>
            {screenShareEnabled && <Live/>}
            {cameraEnabled && <BsCameraVideoFill className='user-in-room-icon' size={20}/>}
            {!micEnabled && <AiOutlineAudioMuted className='user-in-room-icon' size={20}/>}
          </>}
        </div>
      </div>}
    </>
  );
};

export default UserInRoom;