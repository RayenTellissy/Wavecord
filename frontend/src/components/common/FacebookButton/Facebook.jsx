import React from "react"
import { IconButton } from "@chakra-ui/react"
import { FaFacebookF } from "react-icons/fa"

const Facebook = ({ size, color, margin }) => {
  return <IconButton
    margin={margin ? margin : "3"} 
    size={size} color={color} 
    icon={<FaFacebookF />} 
  />
}

export default Facebook