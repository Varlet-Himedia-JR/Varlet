import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import '../../style/header.css';

function Heading() {
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const [profileImg, setProfileImg] = useState('http://localhost:8070/images/user.png');
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 메뉴 열림 상태
    const dispatch = useDispatch();
    const userCookie = getCookie('user');
    
    const LoginWindow = () => {
        navigate('/login');
    };
  
    const JoinWindow = () => {
        navigate('/join');
    };

    const logout = () => {
        dispatch(logoutAction());
        removeCookie("user");
        alert('로그아웃되었습니다');
        navigate('/');
    };

    const logCheck = (src) => {
        if (!userCookie) {
            navigate('/login');
        } else {
            navigate(src);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleNicknameClick = () => {
        navigate('/myPage');
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className='header'>
            <div className='category_menu'>
                <div className='logo'>
                    <img 
                        src="http://localhost:8070/images/varlet.png" 
                        onClick={() => navigate('/')} 
                        alt="Logo"
                    />
                </div>
                <div className='menu-items'>
                    <div className='contents' onClick={() => navigate('/contentsList')}>놀거리</div>
                    <div className='rcommunity' onClick={() => navigate('/rcommunity')}>여행 코스 의뢰</div>
                    <div className='reviewBoard' onClick={() => navigate('/reviewList')}>여행 후기</div>
                    <div className='mycourse' onClick={() => logCheck('/mycourse')}>여행 코스 만들기</div>
                    <div className='mycourse' onClick={() => alert('준비중입니다.')}>숙소</div>
                </div>
                
                <div className='auth-buttons'>
                    {!userCookie && <div className='login' onClick={LoginWindow}>로그인</div>}
                    {!userCookie && <div className='line'></div>}
                    {!userCookie && <div className='join' onClick={JoinWindow}>회원가입</div>}
                </div>
                <div className='loginUserInfo'>
                {userCookie && (
                    <>
                        <div className='profileimg'>
                            <img src={profileImg}  />
                        </div>
                        <div className='myinfo' onClick={handleNicknameClick}>
                            {userCookie.nickname}님
                        </div>
                        <div className='line'></div>
                        <div className='logout' onClick={logout}>로그아웃</div>
                        <div className='mypoint' > 보유 포인트 : {userCookie.point}</div>
                    </>
                )}
                </div>

                {/* 햄버거 메뉴 아이콘 */}
                <div className="hamburger-menu" onClick={toggleMenu}>
                    <div className="bar"></div>
                    <div className="bar"></div>
                    <div className="bar"></div>
                </div>
            </div>

            {/* 사이드바 메뉴 */}
            {isMenuOpen && (
                <div className="side-menu">
                    <button className="close-button" onClick={closeMenu}>×</button>
                    <div className='contents' onClick={() => navigate('/contentsList')}>놀거리</div>
                    <div className='rcommunity' onClick={() => navigate('/rcommunity')}>여행 코스 의뢰</div>
                    <div className='reviewBoard' onClick={() => navigate('/reviewList')}>여행 후기</div>
                    <div className='mycourse' onClick={() => logCheck('/mycourse')}>여행 코스 만들기</div>
                    <div className='mycourse' onClick={() => alert('준비중입니다.')}>숙소</div>
                    {userCookie ? (
                        <>
                            <div className='myinfo' onClick={handleNicknameClick}>
                                {userCookie.nickname}님
                            </div>
                            <div className='logout' onClick={logout}>로그아웃</div>
                            <div className='mypoint' > 보유 포인트 : {userCookie.point}</div>
                        </>
                    ) : (
                        <>
                            <div className='login' onClick={LoginWindow}>로그인</div>
                            <div className='join' onClick={JoinWindow}>회원가입</div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default Heading;
