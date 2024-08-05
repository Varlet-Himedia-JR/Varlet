import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../../style/index.css'
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';

function Heading() {
    const navigate = useNavigate();
    const loginUser = useSelector( state=>state.user );
    const dispatch = useDispatch();

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
                <div onClick={ ()=>{ window.location.href='/kindlist/1' } } >여행 코스 의뢰</div>
                <div onClick={ ()=>{ window.location.href='/kindlist/2' } } >즐길거리</div>
                <div className='logo'>
                    <img src="http://localhost:8070/images/logo.png" onClick={
                        ()=>{ navigate('/') }
                    }/>
                </div>
                <div onClick={ ()=>{ window.location.href='/kindlist/3' } } >리뷰게시판</div>
                <div onClick={ ()=>{ window.location.href='/kindlist/4' } } >숙소</div>
                <div className='gnb'>  

                        {
                            (loginUser.userid)?(
                                <div className='logininfo'>
                                    {loginUser.userid}({loginUser.name})&nbsp;&nbsp;&nbsp;
                                    <Link to='/cartlist' >CART</Link>
                                    <Link to='/mypage' >MYPAGE</Link>
                                    <button onClick={()=>{onLogout()}}>LOGOUT</button>
                                </div>
                            ):(
                                <>
                                    <Link className='login' to='/login'>로그인</Link>
                                    <Link className='join' to='/join'>회원가입</Link>
                                </>
                            )
                        }
                        
                </div>
            </div>
                

        </div>
    )
}

export default Heading
