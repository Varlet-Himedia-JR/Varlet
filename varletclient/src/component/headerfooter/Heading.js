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
                <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 2000 }}>
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
                        {/* 모달샘플 */}
                        <div class="flex flex-col items-center w-40 h-full overflow-hidden text-gray-700 bg-gray-100 rounded">
                            <a class="flex items-center w-full px-3 mt-3" href="#">
                                <svg class="w-8 h-8 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                                </svg>
                                <span class="ml-2 text-sm font-bold">The App</span>
                            </a>
                            <div class="w-full px-2">
                                <div class="flex flex-col items-center w-full mt-3 border-t border-gray-300">
                                    <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                        <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                        </svg>
                                        <span class="ml-2 text-sm font-medium">Dasboard</span>
                                    </a>
                                    <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                        <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                        <span class="ml-2 text-sm font-medium">Search</span>
                                    </a>
                                    <a class="flex items-center w-full h-12 px-3 mt-2 bg-gray-300 rounded" href="#">
                                        <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span class="ml-2 text-sm font-medium">Insights</span>
                                    </a>
                                    <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                        <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                        </svg>
                                        <span class="ml-2 text-sm font-medium">Docs</span>
                                    </a>
                                </div>
                                <div class="flex flex-col items-center w-full mt-2 border-t border-gray-300">
                                    <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                        <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <span class="ml-2 text-sm font-medium">Products</span>
                                    </a>
                                    <a class="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                        <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                        </svg>
                                        <span class="ml-2 text-sm font-medium">Settings</span>
                                    </a>
                                    <a class="relative flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                        <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                        </svg>
                                        <span class="ml-2 text-sm font-medium">Messages</span>
                                        <span class="absolute top-0 left-0 w-2 h-2 mt-2 ml-2 bg-indigo-500 rounded-full"></span>
                                    </a>
                                </div>
                            </div>
                            <a class="flex items-center justify-center w-full h-16 mt-auto bg-gray-200 hover:bg-gray-300" href="#">
                                <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span class="ml-2 text-sm font-medium">Account</span>
                            </a>
                        </div>
                        {/* 샘플 end */}
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
