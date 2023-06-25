import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useToast } from "@chakra-ui/react"

// components

// common components
import Logo from '../../Logo/Logo';
import Spinner from '../../common/Spinner/Spinner';

// styles
import "./Login.css"

const Login = () => {

  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  // regular expressions
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/
  const passwordRegex = /^.{7,}$/

  const handleSubmit = async () => {
    if(!usernameRegex.test(username) || !passwordRegex.test(password)){
      return alert("error")
    }

    setIsLoading(true)

    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/login`,{
      username: username,
      password: password
    })

    setIsLoading(false)

    const result = response.data

    toast({
      title: result.success ? "Success" : "Failed",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 3000,
      isClosable: true
    })
  }

  return (
    <div id="container">
      <div id="all-container">

      <Logo style={{ height: "70%", width: "70%", margin: "auto"}}/>
      <p id="title">Login</p>
      <div id="input-container">
        <input className='input' type='text' placeholder='Enter username' onChange={e => setUsername(e.target.value)}/>
        <input className='input' type='password' placeholder='Enter password' onChange={e => setPassword(e.target.value)}/>
      </div>

      <div id='button-container'>
        <button className='auth' id="login" onClick={handleSubmit}>Log in</button>
        <button className='auth' id="create" onClick={() => navigate("/signup")}>Create Account</button>
      </div>

      </div>

      {isLoading && <Spinner/>}

    </div>
  );
};

export default Login;