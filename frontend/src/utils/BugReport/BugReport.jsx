import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"
import { BeatLoader } from 'react-spinners';

// components
import { Context } from '../../components/Context/Context';

// styles
import "./BugReport.css"

const BugReport = ({ isOpen, onClose }) => {
  const { user } = useContext(Context)
  const [message,setMessage] = useState("")
  const [submitDisabled,setSubmitDisabled] = useState(false)
  const [isLoading,setIsLoading] = useState(false)

  const sendTicket = async () => {
    if (!message || message.length > 500) return
    if (submitDisabled) return
    setSubmitDisabled(true)
    setIsLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_SERVER_URL}/bugReports/createTicket`, {
        senderId: user.id,
        message
      }, {
        withCredentials: true
      })
      onClose()
      setMessage("")
      setSubmitDisabled(false)
      setIsLoading(false)
    }
    catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bgColor="blackAlpha.800" />
      <ModalContent bg="#313338">
        <ModalHeader>
          <div id='bug-report-header-container'>
            <p>Bug Report</p>
          </div>
        </ModalHeader>
        <ModalBody>
          <textarea
            placeholder='What would you like to report?'
            value={message}
            id='bug-report-textarea'
            rows={9}
            onChange={e => setMessage(e.target.value)}
          />
        </ModalBody>
        <ModalFooter justifyContent="center">
          <button id='bug-report-send-ticket' onClick={sendTicket}>
            {isLoading ? <BeatLoader size={8} color='white' /> : "Send Ticket"}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BugReport;