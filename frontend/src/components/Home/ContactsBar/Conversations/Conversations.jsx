import React from 'react';

import Conversation from "./Conversation"

const Conversations = ({ conversations, highlighted, setSelected }) => {

  return (
    <>
      {conversations.map((e,i) => {
        return <Conversation
          key={i}
          id={e.id}
          userId={e.users[0].id}
          username={e.users[0].username}
          image={e.users[0].image}
          status={e.users[0].status}
          highlighted={e.id === highlighted}
          setSelected={setSelected}
        />
      })}
    </>
  );
};

export default Conversations;