import React, { useContext, useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@chakra-ui/react"
import { AiFillBug } from "react-icons/ai"
import axios from 'axios';
import { BeatLoader } from 'react-spinners';

// components
import { Context } from '../../components/Context/Context';

// styles
import "./BugReport.css"

const BugReport = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user } = useContext(Context)
  const [message,setMessage] = useState("")
  const [submitDisabled,setSubmitDisabled] = useState(false)
  const [isLoading,setIsLoading] = useState(false)

  const sendTicket = async () => {
    if(!message) return
    if(submitDisabled) return 
    setSubmitDisabled(true)
    setIsLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/bugReports/createTicket`,{
        senderId: user.id,
        message
      })
      onClose()
      setMessage("")
      setSubmitDisabled(false)
      setIsLoading(false)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <>
      <button id='bug-report-button' onClick={onOpen}>
        <AiFillBug size={30}/>
      </button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay/>
        <ModalContent bg="#313338">
          <ModalHeader>
            <div id='bug-report-header-container'>
              <p>Bug Report</p>
            </div>
          </ModalHeader>
          <ModalBody id='asdljnbasoiujdnas'>
            <textarea value={message} id='bug-report-textarea' rows={9} onChange={e => setMessage(e.target.value)}/>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <button id='bug-report-send-ticket' onClick={sendTicket}>
              {isLoading ? <BeatLoader size={8} color='white'/> : "Send Ticket"}
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default BugReport;