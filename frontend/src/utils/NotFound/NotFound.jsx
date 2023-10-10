import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// components
import Logo from "../../components/common/Logo/Logo"

// styles
import "./NotFound.css"

const NotFound = () => {
  const navigate = useNavigate()
  
  useEffect(() => {
    setTimeout(() => {
      navigate("/")
    }, 1500)
  }, [])

  return (
    <div id='not-found-container'>
      <Logo />
      <p id='not-found-404'>404 Not Found</p>
      <p id='not-found-redirect-text'>You will be redirected...</p>
    </div>
  );
};

export default NotFound;