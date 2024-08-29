import React from 'react';
import '../../style/footer.css';
import { useNavigate } from 'react-router-dom';

function Footer() {
  const navigate = useNavigate();
  return (
    <div className='footer'>
      <div className='footer_menu'>
        <div>이용약관 </div>
        <div>|</div>
        <div>개인정보처리방침 </div>
        <div>|</div>
        <div className='notice' onClick={()=>{navigate('/notice')}}>공지사항 </div>
        <div>|</div>
        <div>운영정책</div>
      </div>
      <div className='footer_menu2'>
      <div className='Copyright'>Copyright 2024.varlet All Right Reserved</div>
      </div>
    </div>
  );
}

export default Footer;