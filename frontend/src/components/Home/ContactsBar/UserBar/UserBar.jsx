import React, { useContext } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMicrophone, faMicrophoneSlash, faHeadset, faGear } from "@fortawesome/free-solid-svg-icons"

// components
import Avatar from "../../../common/Avatar/Avatar"
import { Context } from '../../../Context/Context';

// styles
import "./UserBar.css"

const UserBar = () => {
  const { user, micEnabled, setMicEnabled, displayRoom, setDisplayRoom } = useContext(Context)

  return (
    <div id='home-contacts-userbar-container'>

      <div id='home-contacts-userbar-avatar-section'>

        <Avatar image={user.image} status={user.status}/>

        <div id='home-contacts-userbar-avatar-name-status'>
          <p id='home-contacts-userbar-username'>{user.username}</p>
          <p id='home-contacts-userbar-status'>{user.status === "ONLINE" ? "Online" : (user.status === "BUSY" ? "Busy" : "Invisible")}</p>
        </div>

      </div>

      <div id='home-contacts-userbar-icons-section'>
        <button onClick={() => setMicEnabled(!micEnabled)}>
          <FontAwesomeIcon className='home-contacts-userbar-icon' icon={faMicrophone} />
        </button>
        <button onClick={() => setDisplayRoom(!displayRoom)}>
          <FontAwesomeIcon className='home-contacts-userbar-icon' icon={faHeadset} />
        </button>
        <button><FontAwesomeIcon className='home-contacts-userbar-icon' icon={faGear} /></button>
      </div>
        


    </div>
  );
};

export default UserBar;