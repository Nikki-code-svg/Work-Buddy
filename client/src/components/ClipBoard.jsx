
import React, { useState } from 'react';

function CopyButton({ textToCopy }) {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('Copied!');
      
      // Reset the copy status after 15 seconds
      setTimeout(() => {
        setCopyStatus('Copy');
      }, 15000); // 15000 milliseconds = 15 seconds

    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyStatus('Error');
      
      // Reset the error status after 15 seconds
      setTimeout(() => {
        setCopyStatus('Copy');
      }, 5000); // 15000 milliseconds = 15 seconds
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