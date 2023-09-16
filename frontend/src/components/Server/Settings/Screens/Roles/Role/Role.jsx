import React, { useState } from 'react';
import { RiShieldUserFill } from "react-icons/ri"
import { BiSolidUser } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { Tooltip } from "@chakra-ui/react"
import axios from 'axios';
import ScaleLoader from "react-spinners/ScaleLoader"

// styles
import "./Role.css"

const Role = ({ id, name, color, members, fetchRoles }) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const removeRole = async () => {
    try {
      setIsDeleting(true)
      await axios.delete(`${import.meta.env.VITE_SERVER_URL}/servers/removeRole/${id}`, {}, {
        withCredentials: true
      })
      await fetchRoles()
      setIsDeleting(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <div id='server-settings-roles-onerole-container'>
      <div id='server-settings-roles-onerole-name-container'>
        <RiShieldUserFill color={color} size={40} />
        <p id='server-settings-roles-onerole-name'>{name}</p>
      </div>
      <div id='server-settings-roles-onerole-members-container'>
        <p id='server-settings-roles-onerole-members'>{members}</p>
        <BiSolidUser size={23} />
      </div>
      <div>
        <Tooltip
          label={`Delete ${name} role`}
          placement='bottom'
          bg="blackAlpha.900"
          color="white"
          padding={3}
          hasArrow={true}
          arrowSize={10}
          borderRadius={7}
          margin={1}
          fontFamily="GibsonMedium"
          openDelay={500}
        >
          <button onClick={removeRole}>
            {isDeleting
              ? <ScaleLoader height={17.5} width={2} color='#da373c' />
              : <AiFillDelete size={30} color='#da373c' />}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Role;