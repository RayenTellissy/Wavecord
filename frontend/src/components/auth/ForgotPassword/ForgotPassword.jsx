import { useState } from "react"
import { useToast } from "@chakra-ui/react"
import axios from "axios"

// common components
import Logo from "../../Logo/Logo"
import Spinner from "../../common/Spinner/Spinner"

const ForgotPassword = () => {

  const [email,setEmail] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const toast = useToast()

  const handleSubmit = async () => {

    setIsLoading(true)

    const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/reset`,{ email: email })
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

  return (
    <div id="container">
      <div id="all-container">

      <Logo style={{ height: "70%", width: "70%", margin: "auto"}}/>
      <p id="title">Reset Password</p>
      <div id="input-container">
        <input className='input' type='text' placeholder='Enter email' onChange={e => setEmail(e.target.value)}/>
      </div>

      <div id='button-container'>
        <button className='auth' id="login" onClick={handleSubmit}>Submit</button>
      </div>


      </div>

      {isLoading && <Spinner/>}

    </div>
  )
}

export default ForgotPassword