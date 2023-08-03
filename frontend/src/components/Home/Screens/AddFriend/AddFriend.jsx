import React, { useEffect, useState } from 'react';

// style
import "./AddFriend.css"

const AddFriend = ({ setShowSearch }) => {
  const [query,setQuery] = useState("")

  useEffect(() => {
    setShowSearch(false)
    return () => setShowSearch(true)
  },[])
  
  return (
    <div id='home-right-display-addfriend-container'>
      <div id='home-right-display-addfriend-main'>
        <h2 id='home-right-display-addfriend-title'>ADD FRIEND</h2>
        <p id='home-right-display-addfriend-text'>You can add friends with their Wavecord username.</p>
        <div id='home-right-display-addfriend-input-container'>
          <input 
            className='home-right-display-addfriend-input'
            type='text'
            placeholder='You can add friends with their Wavecord username.'
            onChange={e => setQuery(e.target.value)}
          />
          <button 
            className='home-right-display-addfriend-submit'
            id={query === "" ? "addfriend-submit-inactive" : "addfriend-submit-active"}
          >
            Send Friend Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFriend;