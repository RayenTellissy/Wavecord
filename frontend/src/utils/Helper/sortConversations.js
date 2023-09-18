const sortConversations = (conversationId, conversations) => {
  console.log(conversationId,conversations)
  const index = conversations.findIndex(e => e.id === conversationId)
  if(index !== -1){
    console.log(index)
    const [currentConversation] = conversations.splice(index, 1)
    conversations.unshift(currentConversation)
  }
}

export default sortConversations