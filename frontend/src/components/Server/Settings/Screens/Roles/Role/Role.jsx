import React from 'react';
import { RiShieldUserFill } from "react-icons/ri"
import { BiSolidUser } from "react-icons/bi"
import { AiFillDelete } from "react-icons/ai"
import { Tooltip } from "@chakra-ui/react"

// styles
import "./Role.css"

const Role = ({ id, name, color, members, removeRole }) => {

  return (
    <div id='server-settings-roles-onerole-container'>
      <div id='server-settings-roles-onerole-name-container'>
        <RiShieldUserFill color={color} size={40}/>
        <p id='server-settings-roles-onerole-name'>{ name }</p>
      </div>
      <div id='server-settings-roles-onerole-members-container'>
        <p id='server-settings-roles-onerole-members'>{ members }</p>
        <BiSolidUser size={23}/>
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
          fontFamily="UbuntuMedium"
          openDelay={500}
        >
          <button onClick={() => removeRole(id)}>
            <AiFillDelete size={30} color='#da373c'/>
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Role;