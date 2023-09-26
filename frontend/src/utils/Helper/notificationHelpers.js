// function to check if user has a notification in the current conversation

const conversationHasNotification = (notifications, conversationId) => {
  if(notifications[conversationId]) return true
  return false
}

export { conversationHasNotification }