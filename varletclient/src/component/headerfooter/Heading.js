import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import '../../style/header.css'



function Heading() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [profileimg,setProfileImg] = useState('');
    const dispatch = useDispatch();
    const userCookie = getCookie('user');
    const [ imgSrc, setImgSrc ]=useState('http://localhost:8070/images/user.png');

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
    // useEffect(() => {
    //     if (!userCookie) return;
    //     console.log("쿠키형태"+userCookie);
    //     axios.get('/api/member/getMyProfileImg', { params: { userid: userCookie } })
    //         .then((result) => {
    //             const profileImgUrl = result.data.profileimg;
    //             if (profileImgUrl) {
    //                 setImgSrc(profileImgUrl);
    //             }
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }, [userCookie]);

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
                <div className='contents' onClick={ ()=>{ window.location.href='/contents' } } >놀거리</div>
                <div className='rcommunity'onClick={ ()=>{ navigate('/rcommunity') } }>여행 코스 의뢰</div>
                <div className='reviewBoard' onClick={ ()=>{ window.location.href='/reviewList' } } >여행 후기</div>
                <div className='mycourse' onClick={ ()=>{ logCheck('/mycourse') } } >여행 코스 만들기</div>
                <div className='mycourse' onClick={ ()=>{ navigate('/house') } } >숙소</div>
                <div className='auth-buttons'>
                    {!userCookie && <div className='login' onClick={LoginWindow}>로그인</div>}
                    {!userCookie &&<div className='line'></div>}
                    {!userCookie && <div className='join' onClick={JoinWindow}>회원가입</div>}
                </div>
                    {getCookie('user')? (<div className='profileimg'>{getCookie('user').profileimg}</div>) : null}
                    {getCookie('user')? (<div className='myinfo' onClick={handleNicknameClick}>{getCookie('user').nickname}님</div>) : null}
                    {getCookie('user')? (<div className='line'></div>) : null}
                    {getCookie('user')?<div className='logout' onClick={() => { logout() }}>로그아웃</div>:null}
            </div>
        </div>
    );
}

export default Heading;
