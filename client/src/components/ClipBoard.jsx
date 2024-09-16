
import React, { useState } from 'react';

function CopyButton({ textToCopy }) {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('Copied!');
      
      // Reset the copy status after 5 seconds
      setTimeout(() => {
        setCopyStatus('Copy');
      }, 5000); 

    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyStatus('Error');
      
      // Reset the error status after 5 seconds
      setTimeout(() => {
        setCopyStatus('Copy');
      }, 5000); 
    }
  };

  return (
    <button 
      className='copybtn'
      onClick={handleCopyClick}>
      {copyStatus}
    </button>
  );
}

export default CopyButton;