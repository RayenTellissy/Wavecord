import React from 'react';

// styles
import "./Modal.css"

const Modal = ({ category }) => {
  return (
    <div id='server-create-category-modal-container'>
      {category}
    </div>
  );
};

export default Modal;