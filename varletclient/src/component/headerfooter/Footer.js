import React from 'react';
import '../../style/footer.css';

function Footer() {
  return (
    <div className='footer'>
      <div className='footer_menu'>
        <div>이용약관</div>
        <div className='qna' onClick={ ()=>{ window.location.href='/qna' } } >고객센터</div>
        <div>찾아오시는 길</div>
      </div>

      <div className='footer_menu2'>
      </div>


      


    </div>
  );
}

export default Footer;