import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import Heading from './headerfooter/Heading';
import Footer from './headerfooter/Footer';
import { loginAction, logoutAction } from '../store/userSlice';
import jaxios from '../util/jwtUtil';

import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";

// import '../style/mystargram.css'
function Main() {
  const [loginUser, setLoginUser] = useState({});
  const lUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function logout() {
    dispatch(logoutAction());
    removeCookie("user");
    alert('로그아웃되었습니다');
    navigate('/');
  }
  return (
    <>
    <Heading/>
    <div>
      <h3>메인 내용 들어올 예정</h3>
    </div>
    <Footer/>
    </>
  )
}

export default Main
