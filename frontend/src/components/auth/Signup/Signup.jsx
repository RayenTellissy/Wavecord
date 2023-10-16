import React, { useState, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { useToast, Button } from "@chakra-ui/react"
import { ArrowBackIcon } from "@chakra-ui/icons"

// common components
import Logo from "../../common/Logo/Logo";
import Google from '../../common/GoogleButton/Google';
import Facebook from '../../common/FacebookButton/Facebook';
import { Context } from "../../Context/Context"

// styles
import "./Signup.css"

const Signup = () => {
  const { setUser, handleConnect } = useContext(Context)
  const [username,setUsername] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [wrongUsername,setWrongUsername] = useState(null)
  const [wrongEmail,setWrongEmail] = useState(null)
  const [wrongPassword,setWrongPassword] = useState(null)
  const [isLoading,setIsLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const debounce = useRef(null)

  // regular expressions
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
  const passwordRegex = /^.{7,}$/

  // handle text input functions
  const handleUsernameChange = (e) => {
    setUsername(e.target.value)
    clearTimeout(debounce.current)
    setWrongUsername(null) // removing the alert message when the user starts typing again
    debounce.current = setTimeout(() => {
      if(!usernameRegex.test(e.target.value)){
        setWrongUsername(true)
      }
      else {
        setWrongUsername(false)
      }
    }, 600)
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    clearTimeout(debounce.current)
    setWrongEmail(null) // removing the alert message when the user starts typing again
    debounce.current = setTimeout(() => {
      if(!emailRegex.test(e.target.value)){
        setWrongEmail(true)
      }
      else {
        setWrongEmail(false)
      }
    }, 600)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
    clearTimeout(debounce.current)
    setWrongPassword(null) // removing the alert message when the user starts typing again
    debounce.current = setTimeout(() => {
      if(!passwordRegex.test(e.target.value)){
        setWrongPassword(true)
      }
      else {
        setWrongPassword(false)
      }
    }, 600)
  }

  const handleKeyPress = (e) => {
    if(e.key === "Enter"){
      handleSubmit()
    }
  }

  const inputsCorrect = () => {
    if(usernameRegex.test(username) && emailRegex.test(email) && passwordRegex.test(password)) return true
    return false
  }

  const handleSubmit = async () => {
    try{
      setIsLoading(true)
      
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/signup`, {
        username,
        email,
        password
      }, {
        withCredentials: true
      })

      setIsLoading(false)
  
      const result = response.data
  
      if (result.success) {
        setUser(response.data)
      }
  
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
      }
    }
  }

  return (
    <div id="signup-container">
      <div id="signup-all-container">

        <Logo style={{ height: "70%", width: "70%", margin: "auto" }} />

        <p id="signup-title">Sign up</p>

        <Google size="lg" />
        <Facebook size="lg" />

        <div id="signup-input-container">
          <input 
            className='signup-input' 
            type='text' 
            placeholder='Enter username' 
            onChange={e => handleUsernameChange(e)}
            onKeyDown={e => handleKeyPress(e)}
            autoComplete='off'
            autoFocus
          />
          {(wrongUsername && username) && <p className='signup-wrong-input'>Invalid username format</p>}
          <input
            className='signup-input' 
            type='text' 
            placeholder='Enter email' 
            onChange={e => handleEmailChange(e)}
            onKeyDown={e => handleKeyPress(e)}
            autoComplete='off'
          />
          {(wrongEmail && email) && <p className='signup-wrong-input'>Invalid email format</p>}
          <input 
            className='signup-input' 
            type='password' 
            placeholder='Enter password' 
            onChange={e => handlePasswordChange(e)}
            onKeyDown={e => handleKeyPress(e)}
            autoComplete='off'
          />
          {(wrongPassword && password) && <p className='signup-wrong-input'>Password is too short</p>}
        </div>

        <div id='signup-button-container'>

          <Button
            className='signup-auth'
            colorScheme='teal'
            isLoading={isLoading}
            isDisabled={!inputsCorrect()}
            onClick={handleSubmit}
          >
            Create Account
          </Button>

          <Button
            className='signup-auth'
            colorScheme='gray'
            leftIcon={<ArrowBackIcon />}
            onClick={() => navigate("/login")}
          >
            Back
          </Button>

        </div>

      </div>

    </div>
  );
};

export default Signup;