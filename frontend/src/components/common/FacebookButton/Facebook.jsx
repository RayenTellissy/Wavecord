import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFacebookF } from "@fortawesome/free-brands-svg-icons"
import { IconButton } from "@chakra-ui/react"

const Facebook = ({ size, color, margin }) => {
  return <IconButton
    margin={margin ? margin : "3"} 
    size={size} color={color} 
    icon={<FontAwesomeIcon icon={faFacebookF} />} 
  />
}

export default Facebook