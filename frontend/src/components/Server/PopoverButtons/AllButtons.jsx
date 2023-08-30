import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsFillPersonPlusFill } from "react-icons/bs"
import { MdSettings } from "react-icons/md"
import { BiSolidFolderPlus } from "react-icons/bi"
import { RiDoorOpenLine } from "react-icons/ri"
import { IoIosRemoveCircle } from "react-icons/io"

// components
import PopoverButton from './PopoverButton';

const AllButtons = ({ user, ownerId, onOpen, id }) => {
  const [hovered,setHovered] = useState("")
  const navigate = useNavigate()

  return (
    <div>
      <PopoverButton
        hovered={hovered}
        setHovered={setHovered}
        text="Invite People"
        textColor="blue"
        icon={<BsFillPersonPlusFill size={20} color={hovered === "Invite People" ? 'white' : '#949cf7'}/>}
        callback={() => onOpen()}
      />
      {user.id === ownerId && <>
        <PopoverButton
          hovered={hovered}
          setHovered={setHovered}
          text="Server Settings"
          icon={<MdSettings size={20}/>}
          callback={() => navigate(`/server/settings/${id}`)}
        />
        <PopoverButton
          hovered={hovered}
          setHovered={setHovered}
          text="Create Category"
          icon={<BiSolidFolderPlus size={20}/>}
        />
      </>}
      <PopoverButton
        hovered={hovered}
        setHovered={setHovered}
        text={user.id === ownerId ? "Delete Server" : "Leave Server"}
        textColor="red"
        icon={user.id === ownerId
          ? <IoIosRemoveCircle color={hovered === "Delete Server" ? "white" : '#da373c'} size={20}/>
          : <RiDoorOpenLine color={hovered === "Leave Server" ? "white" : '#da373c'} size={20}
        />}
      />
    </div>
  );
};

export default AllButtons;