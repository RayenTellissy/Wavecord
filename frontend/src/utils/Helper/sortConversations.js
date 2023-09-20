const sortConversations = (conversationId, conversations) => {
  const index = conversations.findIndex(e => e.id === conversationId)
  if(index !== -1){
    const [currentConversation] = conversations.splice(index, 1)
    conversations.unshift(currentConversation)
  }
}

export default sortConversations