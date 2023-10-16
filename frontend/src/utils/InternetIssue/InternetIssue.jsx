import React from 'react';
import Logo from '../../components/common/Logo/Logo';

// styles
import "./InternetIssue.css"

const InternetIssue = () => {
  return (
    <div id='internet-issue-container'>
      <Logo />
      <p id='internet-issue-text'>Internet issue detected...</p>
    </div>
  );
};

export default InternetIssue;