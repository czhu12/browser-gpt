import React, { useState } from 'react';

const ExpandableSidebar = ({children, onClose}) => {
  return (
    // animate__animated animate__slideOutLeft animate__slideInLeft
    <div className={`expandable-sidebar`}>
      <div className="text-end">
        <button onClick={() => {
          onClose();
        }}>{"<"}</button>
      </div>
      {children}
    </div>
  );
};

export default ExpandableSidebar;
