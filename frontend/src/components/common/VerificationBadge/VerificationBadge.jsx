import React from 'react';
import { RiVerifiedBadgeFill } from "react-icons/ri"
import { Tooltip } from "@chakra-ui/react"

// styles
import "./VerificationBadge.css"

const VerificationBadge = () => {
  return <Tooltip
    label="Verified"
    placement='top'
    color="white"
    backgroundColor="black"
    fontFamily="GibsonRegular"
    hasArrow={true}
    arrowSize={10}
    padding="7px 13px"
    borderRadius={7}
  >
    <div>
      <RiVerifiedBadgeFill id='verified-badge' />
    </div>
  </Tooltip> 
};

export default VerificationBadge;