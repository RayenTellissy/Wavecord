const returnFriendsIds = (array) => {
  if(array.length === 0) return []
  var arr = []
  for(var i in array){
    arr.push(array[i].users[0].id)
  }
  return arr
}

const hasConversationWith = (array, id) => {
  if(!array || !id) return false

  for(var i in array){
    if(array[i].users[0].id === id) return true
  }

  return false
}

export { returnFriendsIds, hasConversationWith }