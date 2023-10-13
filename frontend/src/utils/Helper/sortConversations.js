// function used for placing the conversation that the user has sent a message in at the top
const sortConversations = (conversationId, conversations) => {
  const index = conversations.findIndex(e => e.id === conversationId)
  if(index !== -1){
    const reorderedConversations = [
      conversations[index], // placing the current conversation at the beginning
      ...conversations.slice(0, index), // adding conversations before the current conversation
      ...conversations.slice(index + 1), // adding conversations after the current conversation
    ]

    return reorderedConversations
  }
  return conversations // if the index was not found return the original array
}

export default sortConversations