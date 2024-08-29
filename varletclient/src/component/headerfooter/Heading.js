import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { getCookie, removeCookie } from "../../util/cookieUtil";
import '../../style/header.css';

function Heading() {
    const navigate = useNavigate();
    const [profileImg, setProfileImg] = useState('http://localhost:8070/images/user.png');
    const dispatch = useDispatch();
    const userCookie = getCookie('user');

    const [isMenuOpen, setIsMenuOpen] = useState(false); // 햄버거 메뉴 상태
    const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

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

    useEffect(() => {
        if (!userCookie) return;
        const userid = getCookie('user').userid;
        axios.get(`/api/member/getMyProfileImg/${userid}`, {
            params: {
                userid: userid,  // 필요한 추가 정보
            },
        })
            .then((result) => {
                const profileImgUrl = result.data.profileImgUrl;
                if (profileImgUrl) {
                    setProfileImg(profileImgUrl);
                } else {
                    setProfileImg('http://localhost:8070/images/user.png'); // 기본 이미지로 설정
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [userCookie]);

    const handleNicknameClick = () => {
        setIsModalOpen(true); // 모달 창 열기
    };

    const closeModal = () => {
        setIsModalOpen(false); // 모달 창 닫기
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen); // 햄버거 메뉴 열고 닫기
        setIsModalOpen(!isModalOpen);
    };

    return (
        <div className='header'>
            <div className='category_menu'>
                <div className='logo'>
                    <img src="http://localhost:8070/images/varlet.png" onClick={() => navigate('/')} alt="Logo" />
                </div>
                <div className='home' onClick={() => navigate('/')}>홈</div>
                <div className='head_contents' onClick={() => navigate('/contentsList')}>놀거리</div>
                <div className='rcommunity' onClick={() => navigate('/rcommunity')}>여행 코스 의뢰</div>
                <div className='reviewBoard' onClick={() => navigate('/reviewList')}>여행 후기</div>
                <div className='mycourse' onClick={() => logCheck('/mycourse')}>여행 코스 만들기</div>
                <div className='house' onClick={() => alert('준비중입니다.')}>숙소</div>
                {!userCookie &&
                    <div className='login-buttons'>
                        {!userCookie && <div className='login' onClick={LoginWindow}>로그인</div>}
                        {!userCookie && <div className='line'>|</div>}
                        {!userCookie && <div className='join' onClick={JoinWindow}>회원가입</div>}
                    </div>}
                <div className='loginUserInfo'>
                    {(userCookie && !isModalOpen) && (
                        <>
                            <div className='profileimg' onClick={handleNicknameClick}>
                                <img src={profileImg} />
                            </div>
                            <div className='myinfo'>{userCookie.nickname}</div>
                            <div onClick={logout}>로그아웃</div>
                            <div className='hamburger-menu' onClick={toggleMenu}>
                                &#9776; {/* 햄버거 아이콘 */}
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* 햄버거 메뉴 클릭 시 나타나는 모달 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal} style={{zIndex:2000}}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>내 정보</h2>
                            {/* <button className="close-button" onClick={closeModal} style={{ cursor: 'pointer' }}>X</button> */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace cursor-pointer" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={closeModal} >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                <path d="M12 10l4 4m0 -4l-4 4" />
                            </svg>
                        </div>
                        <div className="modal-body">
                            <img src={profileImg} alt="Profile" />
                            <p>{userCookie.nickname}</p>
                            <button onClick={logout}>로그아웃</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Heading;
