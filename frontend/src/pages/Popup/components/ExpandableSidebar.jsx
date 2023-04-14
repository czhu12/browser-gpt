import React, { useState } from 'react';
import CloseIcon from './icons/CloseIcon';

const ExpandableSidebar = ({children, onClose}) => {
  return (
    // animate__animated animate__slideOutLeft animate__slideInLeft
    <div className={`expandable-sidebar`}>
      <div className="text-end mb-3">
        <a href="#" className="text-secondary" onClick={() => {
          onClose();
        }}><CloseIcon /></a>
      </div>
      {children}
    </div>
  );
};

export default ExpandableSidebar;
