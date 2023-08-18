import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// components
import Sidebar from '../Home/Sidebar/Sidebar';
import Category from './Category/Category';
import Modal from './CreateChannel/Modal';

// styles
import "./Server.css"

const Server = () => {
  const { id } = useParams()
  const [server,setServer] = useState({})
  const [currentTextChannel,setCurrentTextChannel] = useState("")
  const [showModal,setShowModal] = useState(false)
  const [categoryChosen,setCategoryChosen] = useState("")
  
  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${id}`)
      setServer(response.data)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='server-container'>
      <Sidebar highlighted={server.id}/>
      <div id='server-bar-container'>
        <div id='server-bar-main'>
          <div id='server-name-container'>
            <p id='server-name'>{server.name}</p>
          </div>
          {server.categories && server.categories.map((e,i) => {
            return <Category 
              key={i} 
              id={e.id} 
              name={e.name} 
              text={e.Text_channels} 
              voice={e.Voice_channels}
              setShowModal={setShowModal}
              setCategoryChosen={setCategoryChosen}
            />
          })}
        </div>
      </div>
      {showModal && <Modal category={categoryChosen}/>}
    </div>
  );
};

export default Server;