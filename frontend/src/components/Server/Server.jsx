import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Server = () => {
  const { id } = useParams()
  const [users,setUsers] = useState([])
  const [name,setName] = useState("")
  const [image,setImage] = useState("")
  
  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/servers/fetch/${id}`)
      setUsers(response.data.UsersInServers)
      setName(response.data.name)
      setImage(response.data.image)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div>
    </div>
  );
};

export default Server;