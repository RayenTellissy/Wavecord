import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@chakra-ui/react"
import { BeatLoader } from 'react-spinners';

// images
import BanGif from "../../../../../../../assets/images/ban-gif.gif"

// styles
import "./ConfirmBanModal.css"

const ConfirmBanModal = ({ action, setAction, isOpen, onClose, username, banUser, kickUser, isProcessing }) => {
  const [reason,setReason] = useState("")

  const closeModal = () => {
    setAction(null)
    onClose()
  }

  const handleSubmit = () => {
    if(action === "ban"){
      return banUser(reason)
    }
    kickUser()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bgColor={"blackAlpha.500"} />
      <ModalContent borderTopRadius={3} bgColor="#313338">
        <ModalHeader>
          <div id='ban-confirmation-header'>
            {action === "ban" ? (
              <>
                Would you like to ban '{ username }?'
              </>
            ) : (
              <>
                Would you like to kick '{ username }'
              </>
            )}
          </div>
        </ModalHeader>
        {action === "ban" && <ModalBody>
          <div>
            <img id='ban-confirmation-gif' src={BanGif} />
            <p id='ban-confirmation-input-label'>REASON FOR BAN</p>
            <textarea
              placeholder='You can specify a reason (optional)'
              id='ban-confirmation-input'
              className='default-scrollbar'
              onChange={e => setReason(e.target.value)}
            />
          </div>
        </ModalBody>}
        <ModalFooter bgColor="#2b2d31" borderBottomRadius={3}>
          <div id='ban-confirmation-footer'>
            <button id='ban-confirmation-back-button' onClick={closeModal}>Back</button>
            <button id='ban-confirmation-submit-button' onClick={handleSubmit}>
              {isProcessing ? <BeatLoader size={6} color='white' /> : (action === "ban" ? "Ban" : "Kick")}
            </button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmBanModal;