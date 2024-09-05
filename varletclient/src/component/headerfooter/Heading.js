import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
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
                <div className='head_contents' onClick={() => navigate('/contentsList')}>컨텐츠</div>
                <div className='rcommunity' onClick={() => navigate('/rcommunity')}>여행 코스 의뢰</div>
                <div className='reviewBoard' onClick={() => navigate('/reviewList')}>여행 후기</div>
                <div className='mycourse' onClick={() => logCheck('/mycourse')}>여행 코스 만들기</div>
                <div className='house' onClick={() => navigate('/house')}>숙소</div>
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
                                <img src={profileImg} alt='profileimg'/>
                            </div>
                            <div className='myinfo'>{userCookie.nickname}</div>
                        </>
                    )}
                </div>

            </div>

            {/* 햄버거 메뉴 클릭 시 나타나는 모달 */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={closeModal} style={{ zIndex: 2000 }}>
                    {/* 모달샘플 */}
                    <div class="flex flex-col items-center w-80 h-full overflow-hidden text-gray-700 bg-gray-100 rounded">
                        <a class="flex items-center justify-between w-full px-3 mt-3" href="#">
                            <div className='profileimg' onClick={handleNicknameClick}>
                                <img src={profileImg} />
                            </div>
                            <span className="ml-2 text-xl font-bold">{userCookie.nickname}님</span>
                            <div onClick={logout}>로그아웃</div>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace cursor-pointer" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={closeModal} >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                <path d="M12 10l4 4m0 -4l-4 4" />
                            </svg>
                        </a>
                        <div className="w-full px-2">
                            <div className="flex flex-col items-center w-full mt-3 border-t border-gray-300">
                                <a onClick={() => navigate('/checkPwd')} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" stroke-width="0" fill="currentColor" />
                                        <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" stroke-width="0" fill="currentColor" />
                                    </svg>
                                    <span className="ml-2 text-sm font-medium" >내 정보</span>
                                </a>
                                <a onClick={() => navigate('/myQNA')} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span className="ml-2 text-sm font-medium">내 Q&A</span>
                                </a>
                                <a onClick={() => navigate('/myREVIEW')} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                    <svg className="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 7h1a2 2 0 0 0 2 -2a1 1 0 0 1 1 -1h6a1 1 0 0 1 1 1a2 2 0 0 0 2 2h1a2 2 0 0 1 2 2v9a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                                    </svg>

                                    <span className="ml-2 text-sm font-medium">내 후기</span>
                                </a>
                                <a onClick={() => navigate('/myREQUEST')} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                    <svg class="w-6 h-6 stroke-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                    <span className="ml-2 text-sm font-medium">내 의뢰목록</span>
                                </a>
                                <a onClick={() => navigate('/myPayment')} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-coin" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                    <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
                                    <path d="M12 7v10" />
                                    </svg>
                                    <span className="ml-2 text-sm font-medium">내 결제목록</span>
                                </a>
                                <a onClick={() => navigate('/qna')} className="flex items-center w-full h-12 px-3 mt-2 rounded hover:bg-gray-300" href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-help-circle-filled" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                    <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 13a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1.368 -6.673a2.98 2.98 0 0 0 -3.631 .728a1 1 0 0 0 1.44 1.383l.171 -.18a.98 .98 0 0 1 1.11 -.15a1 1 0 0 1 -.34 1.886l-.232 .012a1 1 0 0 0 .111 1.994a3 3 0 0 0 1.371 -5.673z" stroke-width="0" fill="currentColor" />
                                    </svg>
                                    <span className="ml-2 text-sm font-medium">고객센터</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Heading;
