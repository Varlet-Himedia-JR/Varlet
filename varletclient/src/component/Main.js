import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import Heading from './headerfooter/Heading';
import Footer from './headerfooter/Footer';
import { loginAction, logoutAction } from '../store/userSlice';
import jaxios from '../util/jwtUtil';

import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";
import '../style/main.css'

function Main() {
  const [loginUser, setLoginUser] = useState({});
  const lUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  
  return (
    <>
    <Heading/>
    <div style={{ paddingTop: '100px' }}>
    <div className='background'><img src="http://localhost:8070/images/Beach.jpg"/></div>
    <div onClick={()=>{navigate("/notice")}}>공지사항</div>
    </div>
    <Footer/>
    </>
  )
}

export default Main
