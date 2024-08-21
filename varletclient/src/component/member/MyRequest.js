import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Link 임포트
import jaxios from '../../util/jwtUtil';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { location1Data, location2Data } from '../request/LocaionData';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import { useSelector } from 'react-redux';

const MyRequest = () => {
    const loginUser = useSelector(state => state.user);
    const userid = getCookie('user');
    const [posts, setPosts] = useState([]);
    const [location, setLocation] = useState('');
    const [location2, setLocation2] = useState('');
    const [isLocation2Visible, setIsLocation2Visible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userid) {
            console.log(userid);
            fetchPosts();
        } else {
            setError('사용자 정보가 없습니다.');
        }
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await jaxios.get(`/api/rcommunity/getMyList/${userid.userid}`);
            console.log('제발');
            console.log(response.data.postlist);
            if (response.data.error) {
                setError(response.data.error);
                setPosts([]);
            } else {
                setPosts(response.data.postlist || []);
                setError(null);
            }
        } catch (err) {
            setError('게시글을 가져오는 데 문제가 발생했습니다.');
            console.error('Error fetching posts:', err);
            setPosts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleLocationChange = (e) => {
        const newLocation = e.target.value;
        setLocation(newLocation);
        setLocation2('');
        setIsLocation2Visible(newLocation !== '');
    };

    const handleLocation2Change = (e) => {
        setLocation2(e.target.value);
    };

    // const cancelSearch = () => {
    //     setLocation('');
    //     setLocation2('');
    //     setIsLocation2Visible(false);
    //     setPosts([]);
    // };

    const maskedId = (userid) => {
        return userid.length > 2 ? userid.slice(0, 2) + '****' : userid;
    };

    return (
        <>
            <Heading />
            <div className='w-full max-w-[1700px] mx-auto px-1 mt-28'>
                <div className='mt-28'>
                    <div className='flex justify-between items-baseline'>
                        <h1 className='text-3xl font-semibold'>MY REQUEST</h1>
                    </div>
                    <div className='w-full'>
                        {/* <ul className='mb-4'>
                            <li className='flex items-center mb-4'>
                                <span className='mr-4 text-lg font-medium'>지역 선택</span>
                                <select
                                    className='border rounded px-2 py-1'
                                    value={location}
                                    onChange={handleLocationChange}
                                >
                                    <option value="">전체</option>
                                    {Object.keys(location1Data).map((key) => (
                                        <option key={key} value={key}>{location1Data[key]}</option>
                                    ))}
                                </select>
                                {location && (
                                    <>
                                        <div className="ml-auto">
                                            {isLocation2Visible && (
                                                <select
                                                    className='border rounded px-2 py-1'
                                                    value={location2}
                                                    onChange={handleLocation2Change}
                                                >
                                                    <option value="">전체</option>
                                                    {location2Data[location]?.map((loc) => (
                                                        <option key={loc.value} value={loc.value}>{loc.label}</option>
                                                    ))}
                                                </select>
                                            )}
                                            <button
                                                className="ml-4 bg-customblue text-white px-4 py-2 rounded"
                                                onClick={fetchPosts}
                                            >
                                                검색
                                            </button>
                                            <button
                                                className="ml-4 bg-red-500 text-white px-4 py-2 rounded"
                                                onClick={cancelSearch}
                                            >
                                                검색 취소
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        </ul> */}
                        <ul>
                            <li className='flex font-bold text-black border-b border-gray-300 pb-2 mb-2'>
                                <span className='w-1/12 text-center'>번호</span>
                                <span className='w-4/12 text-left'>제목</span>
                                <span className='w-2/12 text-center'>지역</span>
                                <span className='w-2/12 text-center'>상세 지역</span>
                                <span className='w-2/12 text-center'>작성자</span>
                                <span className='w-2/12 text-center'>작성일</span>
                                <span className='w-1/12 text-center'>채택 여부</span>
                                <span className='w-1/12 text-center'>조회수</span>
                            </li>
                            {posts.length > 0 ? (
                                posts.slice().reverse().map((post) => (
                                    <li key={post.rnum} className='flex items-center border-b border-gray-300 py-2'>
                                        <span className='w-1/12 text-center bg-blue-500 text-white rounded-full px-2 py-1 text-xs'>
                                            {post.rnum}
                                        </span>
                                        <Link to={`/rCommunityView/${post.rnum}`} className='w-4/12 text-left cursor-pointer text-blue-500'>
                                            {post.title}
                                        </Link>
                                        <span className='w-2/12 text-center'>
                                            {location1Data[post.location] || '정보 없음'}
                                        </span>
                                        <span className='w-2/12 text-center'>
                                            {location2Data[post.location]?.find(item => item.value === post.location2)?.label || "전체"}
                                        </span>
                                        <span className='w-2/12 text-center'>{maskedId(post.userid.userid)}</span>
                                        <span className='w-2/12 text-center'>
                                            {new Date(post.writedate).toLocaleDateString('ko-KR', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit'
                                            }).replace(/\./g, '.').replace(/\.$/, '')}
                                        </span>
                                        <span className="w-1/12 text-center flex items-center justify-center gap-2">
                                            {post.picked === "Y" ? (
                                                <>
                                                    채택 완료
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#1e90ff" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                                        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                        <path d="M9 12l2 2l4 -4" />
                                                    </svg>
                                                </>
                                            ) : (
                                                post.picked === "N" ? "채택되지 않음" : "정보 없음"
                                            )}
                                        </span>
                                        <span className='w-1/12 text-center'>{post.readcount}</span>
                                    </li>
                                ))
                            ) : (
                                <p className='text-center'>게시물이 없습니다.</p>
                            )}
                        </ul>
                        {loading && <p className='text-center'>불러오는 중...</p>}
                        {error && <p className='text-center text-red-500'>{error}</p>}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyRequest;
