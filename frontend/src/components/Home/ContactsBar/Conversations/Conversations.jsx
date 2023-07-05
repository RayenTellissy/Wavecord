import React from 'react';

import Conversation from "./Conversation"

//! THIS ONLY WORKS WITH DIRECT MESSAGES, WITH GROUP CHATS YOU'LL HAVE TO CHANGE THE WAY YOU HANDLE THE USERS ARRAY
const Conversations = ({ conversations, highlighted }) => {

  return (
    <>
      {conversations.map((e,i) => {
        return <Conversation
          key={i}
          id={e.id}
          username={e.users[0].username}
          image={e.users[0].image}
          status={e.users[0].status}
          highlighted={e.id === highlighted}
        />
      })}
    </>
  );
};

export default Conversations;