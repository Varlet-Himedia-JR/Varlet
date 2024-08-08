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

  function pay(){
      jaxios('/api/pay/pay')
  } 

  
  return (
    <>
    <Heading/>
    <div>
        <div onClick={ ()=>{ pay() } } >구매</div>
    </div>
    <Footer/>
    </>
  )
}

export default Main
