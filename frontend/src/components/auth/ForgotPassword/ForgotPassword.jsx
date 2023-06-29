import React, { useState } from "react"
import { useToast, Button } from "@chakra-ui/react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { ArrowBackIcon } from "@chakra-ui/icons"

// common components
import Logo from "../../common/Logo/Logo"

// styles
import "./ForgotPassword.css"

const ForgotPassword = () => {

  const [email,setEmail] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const [isDisabled,setIsDisabled] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  // regular expressions
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
    checkInput(e.target.value)
  }

  const checkInput = (email) => {
    if (emailRegex.test(email)) {
      setIsDisabled(false)
    }
    else {
      setIsDisabled(true)
    }
  }

  const handleSubmit = async () => {

    try{
      setIsLoading(true)
  
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/reset`, { email: email })
      const result = response.data
  
      setIsLoading(false)
  
      toast({
        title: result.success ? "Success" : "Failed",
        description: result.message,
        status: result.success ? "success" : "error",
        duration: 3000,
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
    <div id="forgot-container">
      <div id="forgot-all-container">

        <Logo style={{ height: "70%", width: "70%", margin: "auto" }} />
        <p id="forgot-title">Reset Password</p>
        <div id="forgot-input-container">
          <input className='forgot-input' type='text' placeholder='Enter email' onChange={e => handleEmailChange(e)} />
        </div>

        <div id='forgot-button-container'>
          <Button
            colorScheme="teal"
            isDisabled={isDisabled}
            isLoading={isLoading}
            className='forgot-auth'
            id="forgot-submit"
            onClick={handleSubmit}>
            Submit
          </Button>

          <Button
            colorScheme="gray"
            leftIcon={<ArrowBackIcon />}
            className="forgot-auth"
            onClick={() => navigate("/login")}
          >
            Back
          </Button>

        </div>


      </div>

    </div>
  )
}

export default ForgotPassword