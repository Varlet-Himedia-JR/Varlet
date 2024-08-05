import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
// import { loginAction, setFollowers, setFollowings } from '../store/userSlice';

// import { setCookie, getCookie} from "../util/cookieUtil";

// import '../style/mystargram.css'
function Main() {
    const navigate=useNavigate();
  return (
    <div>
    <h1>Varlet lego</h1>
    <button onClick={ ()=>{ navigate('/login') } }>Login</button>
    <button onClick={ ()=>{ navigate('/qna') } }>Q&A</button>
    <button onClick={ ()=>{ navigate('/rcommunity') } }>Request</button>
    <button onClick={ ()=>{ navigate('/review') } }>REVIEW</button>
    </div>
  )
}

export default Main
