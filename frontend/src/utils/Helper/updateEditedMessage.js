const updateEditedMessage = (messages, messageId, editedMessage, setMessages) => {
  const messagesCopy = [...messages]
  const index = messages.findIndex(e => e.id === messageId)
  if(index !== -1){
    messagesCopy[index].message = editedMessage
    return setMessages(messagesCopy)
  }
  return messages
}

export default updateEditedMessage