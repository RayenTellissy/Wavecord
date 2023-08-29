import React from 'react';
import { SyncLoader } from 'react-spinners';

const noMarginLoader = () => {
  return <SyncLoader color='#0c6bf9' cssOverride={{ alignSelf: "center" }}/>
};

export default noMarginLoader;