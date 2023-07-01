import React from 'react';
import Contact from './Contact';

const Contacts = ({ contacts }) => {
  return (
    <>
      {contacts.map((e,i) => {
        return <Contact name={e.name} image={e.image} status={e.status}/>
      })}
    </>
  );
};

export default Contacts;