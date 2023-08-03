import React from 'react';

const Search = ({ setQuery }) => {
  return (
    <div id='home-contacts-search-container'>
      <input 
        id='home-contacts-search' 
        type='text' 
        placeholder='Find or start a conversation'
        onChange={e => setQuery(e.target.value)}
      />
    </div>
  );
};

export default Search;