import React, { useState, useContext } from 'react';
import axios from "axios"
import { useNavigate } from 'react-router-dom';
import { useToast, Button } from "@chakra-ui/react"
import { ArrowForwardIcon } from "@chakra-ui/icons"

// components
import { Context } from '../../Context/Context';

// common components
import Logo from "../../common/Logo/Logo";
import Google from '../../common/GoogleButton/Google';
import Facebook from '../../common/FacebookButton/Facebook';

// styles
import "./Login.css"

const Login = () => {
  const { setUser, handleConnect } = useContext(Context)
  const [username,setUsername] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [isDisabled,setIsDisabled] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()
  
  // regular expressions
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/
  const passwordRegex = /^.{7,}$/
  
  // handle text input functions
  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    checkInput(e.target.value, password)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    checkInput(username, e.target.value)
  }

  // function to validate user inputs
  const checkInput = (username, password) => {
    if(usernameRegex.test(username) && passwordRegex.test(password)){
      setIsDisabled(false)
    }
    else{
      setIsDisabled(true)
    }
  }

  const handleKeyPress = (e) => {
    if(e.key === "Enter"){
      handleSubmit()
    }
  }

  // login function
  const handleSubmit = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/login`,{
        username: username,
        password: password
      }, {
        withCredentials: true
      })

      setIsLoading(false)

      const result = response.data

      // if user has been authenticated redirect him
      if(result.success){
        setUser(response.data)
        handleConnect() // status update
      }

      // response alert
      toast({
        title: result.success ? "Success" : "Failed",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 2000,
        isClosable: true
      })
    }
    catch(error){
      if(error.message === "Request failed with status code 429"){
        toast({
          title: "Failed",
          description: "Too many requests, please try again later.",
          status: "warning",
          duration: 2000,
          isClosable: true
        })
        setIsLoading(false)
      }
    }
  }

  return (
    <div id="login-container">
      <div id="login-all-container">

      <Logo style={{ height: "70%", width: "70%", margin: "auto"}}/>
      
      <p id="login-title">Login</p>

      <Google size="lg" />
      <Facebook size="lg" />

      <div id="login-input-container">
        <input 
          className='login-input'
          type='text' 
          placeholder='Enter username' 
          onChange={e => handleUsernameChange(e)}
          onKeyDown={e => handleKeyPress(e)}
          autoComplete='off'
        />
        <input 
          className='login-input' 
          type='password' 
          placeholder='Enter password' 
          onChange={e => handlePasswordChange(e)}
          onKeyDown={e => handleKeyPress(e)}
          autoComplete='off'
        />
      </div>

      <div id='login-button-container'>

        <Button 
          id="login-login"
          className='login-auth'
          colorScheme='teal'
          isDisabled={isDisabled}
          isLoading={isLoading}
          onClick={handleSubmit}>
          Log in
        </Button>

        <Button 
          id="login-create"
          className='login-auth'
          colorScheme='gray'
          rightIcon={<ArrowForwardIcon/>}
          onClick={() => navigate("/signup")}>
          Create Account
        </Button>

      </div>

      <p id='login-forgot-password' onClick={() => navigate("/forgotpassword")}>Forgot Password</p>

      </div>


    </div>
  );
};

export default Login;