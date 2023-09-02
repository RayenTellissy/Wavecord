import React from 'react';
import { BiPlus, BiDotsVerticalRounded } from "react-icons/bi"
import { Popover, PopoverBody, PopoverContent, PopoverTrigger } from '@chakra-ui/react';

// components
import Avatar from "../../../../../common/Avatar/Avatar"

// styles
import "./Member.css"

const Member = ({ id, username, image, role }) => {
  return (
    <div id='server-settings-members-member-container'>
      <div id='server-settings-members-member-avatar'>
        <Avatar image={image} />
        <p
          style={role ? {color: role.color, fontFamily: "UbuntuRegular"} : {color: "white", fontFamily: "UbuntuRegular"}}
        >
          { username }
        </p>
      </div>
      <div id='server-settings-members-member-add-button-container'>
        <Popover>
          <PopoverTrigger>
            <button style={{ padding: 5, backgroundColor: '#232428', borderRadius: 7 }}>
              <BiPlus id='server-settings-members-member-add-icon' size={20}/>
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody>
              <div>
                <input placeholder='Role' />
              </div>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
      <div id='server-settings-members-member-dots-container'>
        <BiDotsVerticalRounded size={25}/>
      </div>
    </div>
  );
};

export default Member;