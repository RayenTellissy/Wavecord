// event listeners watching internet status, if a user's internet cuts off it will redirect him to an offline screen
// to let him know about the issue, when the user's internet comes back online the app will reload.
const handleInternetStatus = (navigate) => {
  window.addEventListener("online", () => navigate("/"))
  window.addEventListener("offline", () => navigate("/offline"))
}

const removeListeners = () => {
  window.removeEventListener("online")
  window.removeEventListener("offline")
}

export { handleInternetStatus, removeListeners }