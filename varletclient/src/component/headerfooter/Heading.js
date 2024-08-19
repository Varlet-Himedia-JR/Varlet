import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import '../../style/header.css'



function Heading() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const dispatch = useDispatch();
    const userCookie = getCookie('user');


    const LoginWindow = () => {
        navigate('/login');
    };
  
    const JoinWindow = () =>{
        navigate('/join');
    };


    function logout() {
        dispatch(logoutAction());
        removeCookie("user");
        alert('로그아웃되었습니다');
        navigate('/');
    }

    function logCheck(src) {
        if (getCookie('user') == null) {
            navigate('/login');
        } else {
            navigate(src);
        }
    }

    const handleNicknameClick = () => {
        navigate('/myPage');
    };

    return (
        <div className='header'>
            <div className='category_menu'>
            <div className='logo'>
                    <img src="http://localhost:8070/images/varlet.png" onClick={
                        ()=>{ navigate('/') }
                    }/>
                </div>
                <div className='rcommunity'onClick={ ()=>{ navigate('/rcommunity') } }>여행 코스 의뢰</div>
                <div className='contents' onClick={ ()=>{ window.location.href='/contents' } } >즐길거리</div>
                <div className='reviewBoard' onClick={ ()=>{ window.location.href='/reviewList' } } >리뷰게시판</div>
                <div className='mycourse' onClick={ ()=>{ logCheck('/mycourse') } } >나의 여행</div>
                <div className='auth-buttons'>
                    {!userCookie && <div className='login' onClick={LoginWindow}>로그인</div>}
                    {!userCookie && <div className='join' onClick={JoinWindow}>회원가입</div>}
                </div>
                    {getCookie('user')? (<div className='myinfo' onClick={handleNicknameClick}>{getCookie('user').nickname}님</div>) : null}
                    {getCookie('user')?<div className='logout' onClick={() => { logout() }}>로그아웃</div>:''}
                    <div className='menu'>
                    <img src="http://localhost:8070/images/menu.png" onClick={
                        ()=>{ navigate('/') }
                    }/>
                </div>
            </div>
        </div>
    );
}

export default Heading;
