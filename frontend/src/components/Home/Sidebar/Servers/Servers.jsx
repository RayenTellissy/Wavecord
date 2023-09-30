import React, { useContext } from 'react';

// components
import { Context } from '../../../Context/Context';
import Server from './Server';

const Servers = ({ servers, highlighted }) => {
  const { setCurrentServerId, setDisplay } = useContext(Context)

  return (
    <>
      {servers.map((e,i) => {
          return <Server
          key={i}
          id={e.server.id}
          name={e.server.name}
          image={e.server.image}
          highlighted={highlighted}
          setCurrentServerId={setCurrentServerId}
          setDisplay={setDisplay}
        />
      })}
    </>
  );
};

export default Servers;