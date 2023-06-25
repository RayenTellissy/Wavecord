import React from 'react';

const Signup = () => {

  // regular expressions
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
  const usernameRegex = /^[a-zA-Z0-9]{3,20}$/


  const handleSubmit = async () => {
    if(!emailRegex.test(email) || !usernameRegex.test(username)){
      console.log("false")
    }
  }

  return (
    <div>
      
    </div>
  );
};

export default Signup;