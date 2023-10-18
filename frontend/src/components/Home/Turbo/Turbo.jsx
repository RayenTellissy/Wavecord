import React, { useContext } from 'react';
import axios from 'axios';

// components
import { Context } from '../../Context/Context';

// styles
import "./Turbo.css"
import TurboButton from '../../common/TurboButton/TurboButton';

const Turbo = () => {
  const { user } = useContext(Context)

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/payments/createSession`, {
        id: user.id,
        email: user.email
      }, {
        withCredentials: true
      })

      // navigating to stripe payment form
      window.location.assign(response.data.url)
    }
    catch(error){
      console.log(error)
    }
  }

  return (
    <div id='turbo-container'>
      <h1 id='turbo-title'>Unleash More Fun with Turbo</h1>
      <p id='turbo-title2'>Plans start at only $2.99/month. Cancel anytime</p>
      <TurboButton text="Subscribe" callback={handleSubmit} />
    </div>
  )
}

export default Turbo;