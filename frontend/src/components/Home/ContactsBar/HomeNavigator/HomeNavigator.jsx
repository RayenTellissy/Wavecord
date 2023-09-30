import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBolt, FaUserGroup } from 'react-icons/fa6';

// components
import { Context } from '../../../Context/Context';

// styles
import "./HomeNavigator.css"

const HomeNavigator = ({ selected, setSelected, text, style }) => {
  const navigate = useNavigate()
  const location = useLocation().pathname
  const { setCurrentConversationId, setDisplay } = useContext(Context)

  const handleClick = () => {
    if(location !== "/"){
      return navigate("/", {
        state: {
          navigator: text
        }
      })
    }
    setSelected(text)
    setCurrentConversationId("")
    setDisplay("") // exiting messages component
  }

  return (
    <button 
      id={text === selected ? 'home-navigator-button-selected' : "home-navigator-button"}
      style={{ ...style }}
      onClick={handleClick}
    >
      {text === "Friends"
      ? <FaUserGroup className='home-navigator-icon'/>
      : <FaBolt className='home-navigator-icon' size={25}/>}
      { text }
    </button>
  )
  
};

export default HomeNavigator;