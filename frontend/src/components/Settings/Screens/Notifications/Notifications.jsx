import React, { useContext, useEffect, useState } from 'react';

// components
import Switch from "../../../common/Switch/Switch"
import { Context } from '../../../Context/Context';

// styles
import "./Notifications.css"

const Notifications = () => {
  const { setNotificationsEnabled } = useContext(Context)
  const [desktopEnabled,setDesktopEnabled] = useState(true)
  const [directEnabled,setDirectEnabled] = useState(true)
  const [friendEnabled,setFriendEnabled] = useState(true)

  useEffect(() => {
    localStorage.setItem("notificationsEnabled", JSON.stringify({
      desktop: desktopEnabled,
      directMessages: directEnabled,
      friendRequests: friendEnabled
    }))
    setNotificationsEnabled(JSON.parse(localStorage.getItem("notificationsEnabled")))
  }, [desktopEnabled, directEnabled, friendEnabled])

  return (
    <div id='user-settings-notifications-container'>
      <p id='user-settings-notifications-title'>Notifications</p>
      <div id='user-settings-notifications-holder'>
        <div className='user-settings-notifications-row'>
          <div>
            <p className='user-settings-notifications-row-title'>Enable Desktop Notifications</p>
            <p className='user-settings-notifications-row-text'>
              Allows Wavecord to push incoming notifications to your desktop notifications.
            </p>
          </div>
          <Switch checked={desktopEnabled} setChecked={setDesktopEnabled}/>
        </div>
        <div className='user-settings-notifications-row'>
          <div>
            <p className='user-settings-notifications-row-title'>Enable Direct Message Notifications</p>
            <p className='user-settings-notifications-row-text'>
              Enables notifying of incoming direct messages.
            </p>
          </div>
          <Switch checked={directEnabled} setChecked={setDirectEnabled}/>
        </div>
        <div className='user-settings-notifications-row'>
          <div>
            <p className='user-settings-notifications-row-title'>Enable Friend Request Notifications</p>
            <p className='user-settings-notifications-row-text'>
              Enables notifying of incoming friend requests.
            </p>
          </div>
          <Switch checked={friendEnabled} setChecked={setFriendEnabled}/>
        </div>
      </div>
    </div>
  );
};

export default Notifications;