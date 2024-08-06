import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";

import '../../style/index.css'


function Heading() {
    const navigate = useNavigate();
    const loginUser = useSelector( state=>state.user );
    const dispatch = useDispatch();
    const userCookie = getCookie('user');

    const LoginWindow = () =>{
        window.open('/login','Login','width=500,height=600');
    };
    const JoinWindow = () =>{
        window.open('/join','Join','width=500,height=600');
    };

    function onLogout(){
        axios.get('/api/member/logout')
        .then(()=>{
            dispatch( logoutAction() );
            window.location.href='/';
        })
    }


    return (
        <div className='header'>
            <div className='category_menu'>
                <div onClick={ ()=>{ navigate('/rcommunity') } }>여행 코스 의뢰</div>
                <div onClick={ ()=>{ window.location.href='/kindlist/2' } } >즐길거리</div>
                <div className='logo'>
                    <img src="http://localhost:8070/images/logo.png" onClick={
                        ()=>{ navigate('/') }
                    }/>
                </div>
                <div onClick={ ()=>{ window.location.href='/kindlist/3' } } >리뷰게시판</div>
                <div onClick={ ()=>{ window.location.href='/qna' } } >고객센터</div>
                <div className='gnb'>  
                {!userCookie && <div className='login' onClick={LoginWindow}>로그인</div>}
                {!userCookie && <div className='join' onClick={JoinWindow}>회원가입</div>}
                    {getCookie('user')? (<h2>{getCookie('user').snsid}님 환영합니다</h2>) : null}
                    {getCookie('user')?<div className='logout' onClick={() => { onLogout() }}>Logout</div>:''}
                </div>
            </div>
                

        </div>
    )
}

export default Heading
