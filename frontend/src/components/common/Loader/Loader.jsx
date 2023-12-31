import React from 'react';
import { SyncLoader } from 'react-spinners';

const Loader = () => {
  return <SyncLoader color='#0c6bf9' cssOverride={{ alignSelf: "center", marginTop: 100 }}/>
};

export default Loader;