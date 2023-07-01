import React from 'react';
import Server from './Server';

const Servers = ({ servers }) => {
  return (
    <>
      {servers.map((e,i) => {
        return <Server key={i} id={e.serverId.id} name={e.serverId.name} image={e.serverId.image} />
      })}
    </>
  );
};

export default Servers;