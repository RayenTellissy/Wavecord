import React from 'react';

const Contact = ({ name, image, status }) => {
  return (
    <div>
      {name} | {image} | {status}
    </div>
  );
};

export default Contact;