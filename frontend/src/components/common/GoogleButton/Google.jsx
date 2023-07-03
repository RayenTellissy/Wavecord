import React, { useContext, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { 
  IconButton, 
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast
} from "@chakra-ui/react"
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import axios from "axios";
import BeatLoader from "react-spinners/BeatLoader"
import { useNavigate } from "react-router-dom"

import { auth } from "../../../Firebase/FirebaseApp"
import { Context } from "../../Context/Context";

// styles
import "./Google.css"

const Google = ({ size, color, margin }) => {
  const { setUser } = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [id,setId] = useState("")
  const [email,setEmail] = useState("")
  const [username,setUsername] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  // function to login an existing user
  const signIn = async () => {
    const provider = new GoogleAuthProvider()
    const login = await signInWithPopup(auth, provider)

    setId(login.user.uid)
    setEmail(login.user.email)
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/googleLogin/${login.user.uid}`,{},{
        withCredentials: true
      })
      
      if(!response.data.success){
        return onOpen() // if login wasn't successful open a sign up modal
      }
      toast({
        title: "Success",
        description: "Logged in.",
        status: "success",
        duration: 2000,
        isClosable: true
      })
      
      setUser({ id: response.data.cookie.user.id, loggedIn: true })
      navigate("/")
    }
    catch(error){
      console.log(error)
    }
  }
    
  // function to create an account for a new user
  const handleSubmit = async () => {
    if(username === ""){
      return toast({
        title: "Failed",
        description: "Please provide a username.",
        status: "error",
        duration: 2000,
        isClosable: true
      })
    }

    setIsLoading(true)

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/googleSignup`,{
        id: id,
        username: username,
        email: email
      }, { withCredentials: true })

      const cookie = response.data.cookie
  
      setUser({ id: cookie.user.id, loggedIn: true })
      
      toast({
        title: "Success",
        description: "Logged in.",
        status: "success",
        duration: 2000,
        isClosable: true
      })
      navigate("/")

    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <IconButton
        margin={margin ? margin : "3"} 
        size={size} color={color} 
        icon={<FontAwesomeIcon icon={faGoogle}/>}
        onClick={signIn}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader fontFamily="UbuntuMedium" alignSelf="center">Choose a username</ModalHeader>
            <ModalBody>
              <div className="google-auth-button-modal">
                <input id="google-auth-modal-username" type="text" onChange={e => setUsername(e.target.value)} autoFocus/>
              </div>
            </ModalBody>
            <ModalFooter>
              <div className="google-auth-button-modal">
                <Button colorScheme='blue' mr={3} onClick={handleSubmit}>
                  {isLoading ? <BeatLoader size={8} color="white"/> : "Create"}
                </Button>
              </div>
            </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default Google