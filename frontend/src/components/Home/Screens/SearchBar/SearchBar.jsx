import React from 'react';
import { BiSearch } from "react-icons/bi"

// styles
import "./SearchBar.css"

const SearchBar = ({ setQuery }) => {
  return (
    <div id='home-right-display-container'>
      <div id='home-right-display-search-container'>
        <input 
          id='home-right-display-searchbar' 
          type='text' 
          placeholder='Search'
          onChange={e => setQuery(e.target.value)}
        />
        <BiSearch id='home-right-display-searchbar-icon' color='#a4aab0' size={25}/>
      </div>
    </div>
  );
};

export default SearchBar;