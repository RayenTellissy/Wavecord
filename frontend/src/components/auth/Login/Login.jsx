import React from 'react';

// components

// common components
import Logo from '../../Logo/Logo';

// styles
import "./Login.css"

const Login = () => {
  return (
    <div id="container">
      <div id="all-container">

      <Logo style={{ height: "70%", width: "70%", margin: "auto"}}/>
      <p id="title">Login</p>
      <div id="input-container">
        <input className='input' type='text' placeholder='Enter username'/>
        <input className='input' type='text' placeholder='Enter email'/>
        <input className='input' type='text' placeholder='Enter password'/>
      </div>

      <div id='button-container'>
        <button className='auth' id="login">Log in</button>
        <button className='auth' id="create">Create Account</button>
      </div>

      </div>
    </div>
  );
};

export default Login;