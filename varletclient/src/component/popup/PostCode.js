import React from 'react';
import DaumPostcode from 'react-daum-postcode';

function PostcodePopup() {

  const handleComplete = (data) => {
    window.opener.postMessage({
      zipCode: data.zipCode,
      address: data.address
    }, window.location.origin);
    window.close();
  };

  return (

    <DaumPostcode onComplete={handleComplete} />

  );
}

export default PostcodePopup;