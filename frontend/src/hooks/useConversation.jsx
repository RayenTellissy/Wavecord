import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const useConversation = () => {
  const [conversationChosen,setConversationChosen] = useState({})

  useEffect(() => {
    const cookie = Cookies.get("conversationChosen")
    if(cookie){
      setConversationChosen(JSON.parse(cookie))
    }
  },[])

  return [conversationChosen,setConversationChosen]
};

export default useConversation;