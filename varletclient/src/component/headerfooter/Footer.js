import React from 'react';
import '../../style/footer.css';

function Footer() {
  return (
    <div className='footer'>
      <div className='beautiful'><img src="http://localhost:8070/images/beautiful.png"/></div>
      <div className='seashell'><img src="http://localhost:8070/images/seashell1.png"/></div>
      <div className='varlet'><img src="http://localhost:8070/images/varlet.png"/></div>
      <div className='seashell'><img src="http://localhost:8070/images/seashell2.png"/></div>
      <div className='footer_menu'>
        <div>이용약관</div>
        <div className='qna' onClick={ ()=>{ window.location.href='/qna' } } >고객센터</div>
        <div>찾아오시는 길</div>
      </div>

      <div className='footer_menu2'>
        <div>쿠키 정책</div>
        <div>개인정보처리방침</div>
        <div>서비스 약관</div>
      </div>
      <div className='starfish'><img src="http://localhost:8070/images/starfish4.png"/></div>
      <div className='seashell'><img src="http://localhost:8070/images/seashell3.png"/></div>
      <div className='clam'><img src="http://localhost:8070/images/clam.png"/></div>
      <div className='treasure-chest'><img src="http://localhost:8070/images/chest.png"/></div>
      <div className='customer'>대표전화 1111-1111</div>

      


    </div>
  );
}

export default Footer;