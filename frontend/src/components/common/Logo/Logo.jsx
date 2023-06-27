import React from 'react';

import Image from "../../../assets/images/Logo.png"

const Logo = ({ style }) => {
  return <img src={Image} style={{ ...style }}/>
};

export default Logo;