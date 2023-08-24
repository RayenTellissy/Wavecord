import React from 'react';
import Server from './Server';

const Servers = ({ servers, highlighted }) => {
  return (
    <>
      {servers.map((e,i) => {
        return <Server key={i} id={e.server.id} name={e.server.name} image={e.server.image} highlighted={highlighted} />
      })}
    </>
  );
};

export default Servers;