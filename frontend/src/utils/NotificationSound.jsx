import React from 'react';
import useSound from 'use-sound';

// sounds
import Notification from "../assets/sounds/Notification.mp3"

const NotificationSound = () => {
  const [playNotification] = useSound(Notification, { volume: 0.5 })

  const play = () => {
    playNotification()
  }

  return <button style={{ display: "none" }} id='wavecord-default-notification-sound' onClick={play}/>
};

export default NotificationSound;