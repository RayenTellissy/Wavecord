import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useToast, Button } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"

// common components
import Logo from "../../Logo/Logo";
import Google from '../../common/GoogleButton/Google';
import Facebook from '../../common/FacebookButton/Facebook';

// styles
import "./Signup.css"

const Signup = () => {

  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [isDisabled,setIsDisabled] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  // regular expressions
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/
  const passwordRegex = /^.{7,}$/

  // handle text input functions
  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    checkInput(e.target.value, email, password)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    checkInput(username, e.target.value, password)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    checkInput(username, email, e.target.value)
  }

  // function to validate user inputs
  const checkInput = (username, email, password) => {
    if(usernameRegex.test(username) && passwordRegex.test(password) && emailRegex.test(email)){
      setIsDisabled(false)
    }
    else{
      setIsDisabled(true)
    }
  }


  const handleSubmit = async () => {

    setIsLoading(true)

    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/signup`,{
      username: username,
      email: email,
      password: password
    })

    setIsLoading(false)

    const result = response.data
    
    // if user has been authenticated move redirect him
    if(result.success){
      navigate("/home")
    }
    
    toast({
      title: result.success ? "Success" : "Failed",
      description: result.message,
      status: result.success ? "success" : "error",
      duration: 2000,
      isClosable: true
    })
    
  }

  return (
    <div id="signup-container">
      <div id="signup-all-container">

        <Logo style={{ height: "70%", width: "70%", margin: "auto"}}/>
        
        <p id="signup-title">Sign up</p>

        <Google size="lg" />
        <Facebook size="lg" />

        <div id="signup-input-container">
          <input className='signup-input' type='text' placeholder='Enter username' onChange={e => handleUsernameChange(e)}/>
          <input className='signup-input' type='text' placeholder='Enter email' onChange={e => handleEmailChange(e)}/>
          <input className='signup-input' type='password' placeholder='Enter password' onChange={e => handlePasswordChange(e)}/>
        </div>

        <div id='signup-button-container'>
          
          <Button 
            id="signup-create"
            className='signup-auth'
            colorScheme='teal'
            isDisabled={isDisabled}
            isLoading={isLoading}
            onClick={handleSubmit}>
            Create Account
          </Button>

          <Button 
            className='signup-auth'
            colorScheme='gray'
            leftIcon={<ArrowBackIcon/>}
            onClick={() => navigate("/login")}>
            Back
          </Button>

        </div>

      </div>

    </div>
  );
};

export default Signup;