import React from 'react';
import DaumPostcode from 'react-daum-postcode';
// 우편번호 찾기 팝업
function PostcodePopup() {
  const handleComplete = (data) => {
    if (data && data.zonecode && data.address) {
      window.opener.postMessage({
        zip_code: data.zonecode, // DaumPostcode에서 가져온 우편번호는 zonecode입니다.
        address: data.address
      }, window.opener.location.origin);
      window.close();
    } else {
      console.error('올바른 데이터를 받지 못했습니다:', data);
    }
  };
  return (
    <DaumPostcode onComplete={handleComplete} />
  );
}

export default PostcodePopup;