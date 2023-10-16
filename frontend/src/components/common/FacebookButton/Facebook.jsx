import React, { useContext, useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  IconButton,
  useDisclosure,
  useToast,
  Button
} from "@chakra-ui/react"
import { FaFacebookF } from "react-icons/fa"
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth"
import axios from "axios"
import BeatLoader from "react-spinners/BeatLoader"

// components
import { Context } from "../../Context/Context"
import { auth } from "../../../Firebase/FirebaseApp"

// styles
import "./Facebook.css"

const Facebook = ({ size, color, margin }) => {
  const { setUser } = useContext(Context)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [id,setId] = useState("")
  const [email,setEmail] = useState("")
  const [username,setUsername] = useState("")
  const [isLoading,setIsLoading] = useState(false)
  const toast = useToast()

  const signIn = async () => {
    const provider = new FacebookAuthProvider()
    const login = await signInWithPopup(auth, provider)

    setId(login.user.uid)
    setEmail(login.user.email)

    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/providerLogin/${login.user.uid}`, {}, {
        withCredentials: true
      })

      if (!response.data.success) {
        return onOpen() // if login wasn't successful open a sign up modal
      }
      setUser(response.data)
      toast({
        title: "Success",
        description: "Logged in.",
        status: "success",
        duration: 2000,
        isClosable: true
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  // function to create an account for a new user
  const handleSubmit = async () => {
    if (username === "") {
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
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/users/providerSignup`, {
        id,
        username,
        email
      }, {
        withCredentials: true
      })

      setUser(response.data)
      toast({
        title: "Success",
        description: "Logged in.",
        status: "success",
        duration: 2000,
        isClosable: true
      })
    }
    catch (error) {
      console.log(error)
    }
  }

  return <>
    <IconButton
      margin={margin ? margin : "3"} 
      size={size} color={color} 
      icon={<FaFacebookF />} 
      onClick={signIn}
    />
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bgColor="blackAlpha.800" />
        <ModalContent bgColor="#313338">
          <ModalHeader fontFamily="GibsonMedium" alignSelf="center">Choose a username</ModalHeader>
          <ModalBody>
            <div className="facebook-auth-button-modal">
              <input
                id="facebook-auth-modal-username"
                type="text"
                onChange={e => setUsername(e.target.value)}
                autoFocus
                autoComplete='off'
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="facebook-auth-button-modal">
              <Button bgColor="#5865f2" onClick={handleSubmit}>
                {isLoading ? <BeatLoader size={8} color="white" /> : "Create"}
              </Button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
  </>
}

export default Facebook