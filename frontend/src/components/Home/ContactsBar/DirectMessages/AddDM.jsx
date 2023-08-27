import React, { useState } from 'react';
import { BsSquare, BsCheckSquare } from "react-icons/bs"

// components
import Avatar from '../../../common/Avatar/Avatar';

// styles
import "./AddDM.css"

const AddDM = ({ id, username, image, status, setChosenFriend }) => {
  const [checked,setChecked] = useState(false)

  const handleClick = () => {
    if(!checked){
      setChecked(true)
      setChosenFriend(id)
    }
    else {
      setChecked(false)
      setChosenFriend("")
    }
  }

  return (
    <div id='add-dm-button-container'>
      <button id='add-dm-button' onClick={handleClick}>
        <div id='add-dm-button-avatar-container'>
          <Avatar image={image} status={status}/>
          <p id='add-dm-button-username'>{ username }</p>
        </div>
        <div id='add-dm-button-check-container'>
          {checked ? <BsCheckSquare size={25}/> : <BsSquare size={25}/>}
        </div>
      </button>
    </div>
  );
};

export default AddDM;