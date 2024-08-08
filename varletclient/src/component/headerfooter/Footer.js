import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import '../../style/footer.css'
import axios from 'axios';

function Footer() {
  return (
    <div className='footer'>
        <h3>varlet</h3>
        <div className='customer'>
            고객센터 1111-1111
        </div>
        <div className='footer_menu'>
            <div>이용약관</div>
            <div>도움말</div>
            <div>로그인</div>
        </div>
        <div className='footer_menu2'>
            <div>서비스 약관</div>
            <div>개인정보처리방침</div>
            <div>회사정보</div>
            <div>쿠키설정</div>
        </div>


    </div>
  )
}

export default Footer