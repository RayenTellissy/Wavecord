import React, { useContext, useState } from 'react';
import { useDisclosure } from '@chakra-ui/react';

// components
import { Context } from '../../../Context/Context';
import ChangeUsernameModal from './ChangeUsernameModal/ChangeUsernameModal';
import ChangePasswordModal from './ChangePasswordModal/ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal/DeleteAccountModal';
import OwnsServerModal from './OwnsServerModal/OwnsServerModal';

// styles
import "./MyAccount.css"

const MyAccount = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: passisOpen, onOpen: passOnOpen, onClose: passOnClose } = useDisclosure()
  const { isOpen: deleteIsOpen, onOpen: deleteOnOpen, onClose: deleteOnClose } = useDisclosure()
  const { isOpen: ownsIsOpen, onOpen: ownsOnOpen, onClose: ownsOnClose } = useDisclosure()
  const { user, setUser, status } = useContext(Context)
  const [emailHidden,setEmailHidden] = useState(true)
  
  const hideEmail = (email) => {
    const index = email.indexOf("@")
    
    if(index !== -1){
      const hiddenEmail = email.replace(email.slice(0, index), "*".repeat(index))
      return hiddenEmail
    }

    return email
  }

  return (
    <div id='user-settings-myaccount-container'>
      <p id='user-settings-myaccount-title'>My Account</p>
      <div id='user-settings-myaccount-holder'>
        <div id='user-settings-myaccount-username-image-container'>
          <div id='user-settings-myaccount-image-container'>
            <img id='user-settings-myaccount-image' src={user.image} />
            <div id='user-settings-myaccount-status' style={{ backgroundColor: status === "ONLINE" ? "#24A35B" : (status === "BUSY" ? "#E33B42" : "#A0A0A0") }}/>
          </div>
          <p id='user-settings-myaccount-username'>{ user.username }</p>
        </div>
        <div id='user-settings-myaccount-all-information'>
          <div id='user-settings-myaccount-all-information-editor'>
            <div className='user-settings-myaccount-all-information-row'>
              <ChangeUsernameModal user={user} setUser={setUser} isOpen={isOpen} onClose={onClose}/>
              <div>
                <p className='user-settings-myaccount-editor-title'>USERNAME</p>
                <p className='user-settings-myaccount-editor-content'>{ user.username }</p>
              </div>
              <button className='user-settings-myaccount-editor-edit-button' onClick={onOpen}>Edit</button>
            </div>
            <div className='user-settings-myaccount-all-information-row'>
              <div>
                <p className='user-settings-myaccount-editor-title'>EMAIL</p>
                <div id='user-settings-myaccount-editor-email-container'>
                  <p className='user-settings-myaccount-editor-content'>
                    {emailHidden ? hideEmail(user.email) : user.email}
                  </p>
                  <button id='user-settings-myaccount-email-reveal' onClick={() => setEmailHidden(!emailHidden)}>
                    {emailHidden ? "Reveal" : "Hide"}
                  </button>
                </div>
              </div>
              <button className='user-settings-myaccount-editor-edit-button'>Edit</button>
            </div>
          </div>
        </div>
      </div>

      <div className='user-settings-myaccount-seperator'/>

      <div id='user-settings-auth-container'>
        <ChangePasswordModal user={user} isOpen={passisOpen} onClose={passOnClose}/>
        <p id='user-settings-auth-title'>Password and Authentication</p>
        <button id='user-settings-password-change-button' onClick={passOnOpen}>Change Password</button>
      </div>

      <div className='user-settings-myaccount-seperator'/>

      <div id='user-settings-account-removal-container'>
        <DeleteAccountModal id={user.id} isOpen={deleteIsOpen} onOpen={deleteOnOpen} onClose={deleteOnClose} ownsOnOpen={ownsOnOpen}/>
        <OwnsServerModal isOpen={ownsIsOpen} onClose={ownsOnClose}/>
        <p id='user-settings-account-removal-title'>ACCOUNT REMOVAL</p>
        <p id='user-settings-account-removal-warning'>Deleting your account means you won't be able to recover it at any time after taking this action.</p>
        <button id='user-settings-account-removal-delete-button' onClick={deleteOnOpen}>Delete Account</button>
      </div>

    </div>
  );
};

export default MyAccount;