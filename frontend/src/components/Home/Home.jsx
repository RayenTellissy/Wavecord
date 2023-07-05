import React from 'react';
import axios from "axios"

// components
import Sidebar from './Sidebar/Sidebar';
import ContactsBar from './ContactsBar/ContactsBar';

// styles
import "./Home.css"

const Home = () => {

  return (
    <div>
      
      <div id='home-container'>
        
        <Sidebar/>
        <ContactsBar/>

        <div>
          <button onClick={async () => {
            await axios.get(`${import.meta.env.VITE_SERVER_URL}/users/logout`, { withCredentials: true })
          }}>
            log out
          </button>
        </div>

      </div>

    </div>
  );
};

export default Home;