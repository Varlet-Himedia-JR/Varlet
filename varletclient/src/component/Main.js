import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import Heading from './headerfooter/Heading';
import Footer from './headerfooter/Footer';
// import { loginAction, setFollowers, setFollowings } from '../store/userSlice';

// import { setCookie, getCookie} from "../util/cookieUtil";

// import '../style/mystargram.css'
function Main() {
    const navigate=useNavigate();
  return (
    <>
    <Heading/>
    <div>
    <button onClick={ ()=>{ navigate('/login') } }>Login</button>
    <button onClick={ ()=>{ navigate('/qna') } }>Q&A</button>
    <button onClick={ ()=>{ navigate('/quest') } }>QUEST</button>
    <button onClick={ ()=>{ navigate('/review') } }>REVIEW</button>
    </div>
    <Footer/>
    </>
  )
}

export default Main
