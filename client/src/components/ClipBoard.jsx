import React, { useState } from 'react';

function CopyButton({ textToCopy }) {
  const [copyStatus, setCopyStatus] = useState('Copy');

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopyStatus('Copied!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      setCopyStatus('Error');
    }
  };

  return (
    <button onClick={handleCopyClick}>
      {copyStatus}
    </button>
  );
}

export default CopyButton;