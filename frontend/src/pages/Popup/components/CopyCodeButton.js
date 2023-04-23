import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';
import CopyCheckIcon from './icons/CopyCheckIcon';

const CopyCodeButton = ({children}) => {
  const [copyOk, setCopyOk] = useState(false);

  const handleClick = (e) => {
    navigator.clipboard.writeText(children[0].props.children[0]);

    setCopyOk(true);
    setTimeout(() => {
      setCopyOk(false);
    }, 500);
  }

  return (
      <div className="code-copy-btn">
        {copyOk && <span className="copy-ok"><CopyCheckIcon /> Copied!</span>}
        {!copyOk && (
          <a href="#" className="link-unstyled" onClick={handleClick}>
            <CopyIcon /> Copy code
          </a>
        )}
      </div>
  )
};

export default CopyCodeButton;
