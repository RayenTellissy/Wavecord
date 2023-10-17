import React from 'react';

// components
import SimpleLoader from '../SimpleLoader/SimpleLoader';

// styles
import "./UsersLoader.css"

const UsersLoader = ({ text }) => {
  return (
    <div id='home-right-display-users-loader'>
      <SimpleLoader />
      <p id='home-right-display-users-loading-text'>{ text }</p>
    </div>
  );
};

export default UsersLoader;