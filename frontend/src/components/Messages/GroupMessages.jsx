import React, { useEffect, useState } from 'react';

// components
import Message from "./Message"

const GroupMessages = ({ messages, setIsLoading }) => {
  const [messageList,setMessageList] = useState([])

  useEffect(() => {
    groupMessages(messages)
  },[messages])

  // a function that returns a boolean, whether two messages should be grouped or not
  const shouldGroupMessages = (prevTimestamp, currentTimestamp) => {
    const timeThreshold = 5 * 60 * 1000

    const prevTime = new Date(prevTimestamp)
    const currentTime = new Date(currentTimestamp)

    const timeDifference = Math.abs(currentTime - prevTime)
    return timeDifference <= timeThreshold
  }

  // function that groups messages together incase they're both sent within 5 minutes
  const groupMessages = (messages) => {
    const groupedMessages = []
    var currentGroup = {
      author: null,
      messages: []
    }

    for(var i = 0 ; i < messages.length ; i++){
      const currentMessage = messages[i]
      const prevMessage = messages[i - 1]

      if(
        prevMessage
        && prevMessage.sender === currentMessage.sender
        && shouldGroupMessages(prevMessage.created_at,currentMessage.created_at)
        )
      {
        currentGroup.messages.push(currentMessage)
        currentGroup.author = currentMessage.usersId.username
      }
      else{
        currentGroup = {
          author: currentMessage.usersId.username,
          messages: [currentMessage]
        }
        groupedMessages.push(currentGroup)
      }
      setMessageList(groupedMessages)
      setIsLoading(false)
    }
  }

  return (
    <>
      {messageList.map((e,i) => {
        if(e.messages.length === 1){
          return <Message key={i} username={e.messages[0].usersId.username} image={e.messages[0].usersId.image} message={e.messages} created_at={e.messages[0].created_at}/>
        }
        return <Message key={i} username={e.messages[0].usersId.username} image={e.messages[0].usersId.image} message={e.messages} created_at={e.messages[0].created_at}/>
      })}
    </>
  );
};

export default GroupMessages;