import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link 임포트
import jaxios from '../../util/jwtUtil';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { location1Data, location2Data } from '../request/LocaionData';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { cookies } from 'next/headers';

const MyRequest = () => {
    const loginUser = useSelector(state => state.user);
    const [posts, setPosts] = useState([]);
    const [isLocation2Visible, setIsLocation2Visible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const userCookie = getCookie('user');
    const navigate = useNavigate();

    useEffect(() => {
        if (userCookie) {
            console.log("userid is already1", userCookie.userid)
            fetchAllPosts(userCookie.userid);
        } else {
            setError('로그인 정보가 없습니다.');
        }
    }, []);
    
    const fetchAllPosts = async (userId) => {
        console.log("userid is already2", userId);
        try {
            const response = await jaxios.get('/api/rcommunity/getMyList', {
                params: { userId: userId }
            });
            if (response && response.data) {
                setPosts(response.data.postlist);
                setError(null);
            } else {
                console.error('Response is missing data:', response);
                setError('게시글을 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('Error fetching posts:', error.response ? error.response.data : error.message);
            setError('게시글을 가져오는 데 실패했습니다.');
        }
    };

    const logCheck = (src) => {
        if (getCookie('user') == null) {
          alert("로그인이 필요한 서비스입니다.");
          navigate('/login');
        } else {
          console.log(cookies)
          navigate(src);
        }
      };

    return (
        <>
            <Heading />
            <section className="w-full bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] mt-28" style={{
          backgroundImage: 'url(http://localhost:8070/images/oceans.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',   // 원하는 너비 설정
          zIndex: 0,
          marginTop:'100px'
        }}></section>
            <div className='w-full max-w-[1500px] mx-auto px-1 '>
            <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg h-200 min-h-full">
        <div className='mt-14'>
          <div className='flex justify-between items-baseline'>
            <h1 className='text-3xl font-semibold pb-5'>MY REQUEST</h1>
          </div>
            <ul>
            <li className='flex font-bold justify-center items-center text-black border-b border-gray-300 pb-2 mb-2'>
                <span className='w-1/12 text-center'>번호</span>
                <span className='w-4/12 text-left'>제목</span>
                <span className='w-2/12 text-center'>지역</span>
                <span className='w-2/12 text-center'>상세 지역</span>
                <span className='w-2/12 text-center'>작성자</span>
                <span className='w-2/12 text-center'>작성일</span>
                <span className='w-2/12 text-center'>채택 여부</span>
                <span className='w-1/12 text-center'>조회수</span>
            </li>
            {posts.length === 0 ? (
                <li className='text-center w-full py-4'>게시글이 없습니다.</li>
            ) : (
                posts.map(post => (
                    <li key={post.rnum} className='flex items-center justify-center border-b border-gray-300 py-2 h-20'>
                        <span className='w-1/12 text-center bg-blue-500 text-white rounded-full px-2 py-1 text-lg'>
                            {post.rnum}
                        </span>
                        <span className='w-4/12 text-left cursor-pointer text-blue-500 text-lg' 
                        onClick={ ()=>{ logCheck(`/RcommunityView/${post.rnum}`) } }
                        >
                            {post.title}
                        </span>
                        <span className='w-2/12 text-center text-lg'>{location1Data[post.location]}</span>
                        <span className='w-2/12 text-center text-lg'>
                            {location2Data[post.location]?.find(item => item.value === post.location2)?.label || "전체"}
                        </span>
                        <span className="w-2/12 text-center text-lg">{post.userid.userid}</span>
                        <span className='w-2/12 text-center text-lg'>
                            {new Date(post.writedate).toLocaleDateString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                            }).replace(/\./g, '.').replace(/\.$/, '')}
                        </span>
                        <span className="ml-left w-2/12 text-center flex items-center justify-center gap-2 text-lg">
                            {post.picked === "Y" ? (
                                <>
                                    채택 완료
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#1e90ff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                        <path d="M9 12l2 2l4 -4" />
                                    </svg>
                                </>
                            ) : (
                                post.picked === "N" ? "채택 진행중" : "미정"
                            )}
                        </span>
                        <span className='w-1/12 text-center text-lg'>{post.views}</span>
                    </li>
                ))
            )}
        </ul>
        </div>
        </div>
        </div>

            <Footer />
        </>
    );
};

export default MyRequest;
