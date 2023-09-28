const createFriendRequestNotification = ({ username, image }) => {
  // console.log(username, image, callback)
  const notify = () => {
    const notification = new Notification(username, {
      body: "Sent a friend request.",
      icon: image,
      silent: true
    })
  
    // closing notification after 4 seconds
    setTimeout(() => {
      notification.close()
    }, 4000)
  }

  // checking for permission
  if(Notification.permission === "granted"){
    notify()
  }
  else {
    // if no permission is granted ask for permission
    Notification.requestPermission().then(response => {
      if(response === "granted"){
        notify()
      }
      else {
        console.log("Notifications Permission not granted.")
      }
    })
  }
}

const createDirectMessageNotification = ({ username, image, message, callback }) => {
  const notify = () => {
    const notification = new Notification(username, {
      body: message,
      icon: image,
      silent: true
    })

    // adding an onclick event to navigate
    notification.addEventListener("click", callback)

    // closing the notification after 4 seconds
    setTimeout(() => {
      notification.close()
    }, 4000)
  }

  if(Notification.permission === "granted"){
    notify()
  }
  else {
    Notification.requestPermission().then(response => {
      if(response === "granted"){
        notify()
      }
      else {
        console.log("Notifications Permission not granted.")
      }
    })
  }
}

export { createFriendRequestNotification, createDirectMessageNotification }