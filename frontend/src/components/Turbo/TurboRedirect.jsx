import React from 'react';
import { LuZap } from 'react-icons/lu';
import { useNavigate, useSearchParams } from 'react-router-dom';

// components
import TurboButton from '../common/TurboButton/TurboButton';

// styles
import "./TurboRedirect.css"

const TurboRedirect = () => {
  const [searchParams,setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const success = searchParams.get("success")

  if(success == 1){
    return (
      <div className='turbo-redirect-success-container'>
        <LuZap size={100} />
        <p className='turbo-redirect-text'>Welcome to Turbo!</p>
        <TurboButton text="Continue to Wavecord!" callback={() => navigate("/")} />
      </div>
    )
  }
  
  return (
    <div className='turbo-redirect-success-container'>
      <LuZap size={100} />
      <p className='turbo-redirect-text'>Payment failed, please try again later...</p>
      <TurboButton text="Continue to Wavecord" callback={() => navigate("/")} />
    </div>
  );
};

export default TurboRedirect;