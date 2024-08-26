import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { location1Data, location2Data } from '../request/LocaionData';
import { getCookie } from "../../util/cookieUtil";
import { useSelector } from 'react-redux';

const MyRequest = () => {
    const loginUser = useSelector(state => state.user);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const pageRange = 10; // 한번에 보여줄 페이지 범위
    const [page, setPage] = useState(1); // 현재 페이지 상태 추가

    const userCookie = getCookie('user');
    const navigate = useNavigate();

    useEffect(() => {
        if (userCookie) {
            fetchAllPosts(userCookie.userid, currentPage, pageSize);
        } else {
            setError('로그인 정보가 없습니다.');
        }
    }, [currentPage, pageSize]);

    const fetchAllPosts = async (userId, page, size) => {
        try {
            const response = await jaxios.get('/api/rcommunity/getMyList', {
                params: { userId: userId, page: page, size: size }
            });
            if (response && response.data) {
                setPosts(response.data.postlist);
                setTotalPages(response.data.totalPages);
                setError(null);
            } else {
                setError('게시글을 가져오는 데 실패했습니다.');
            }
        } catch (error) {
            setError('게시글을 가져오는 데 실패했습니다.');
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const logCheck = (src) => {
        if (!userCookie) {
            alert("로그인이 필요한 서비스입니다.");
            navigate('/login');
        } else {
            navigate(src);
        }
    };

    const startPage = Math.floor(currentPage / pageRange) * pageRange;
    const endPage = Math.min(startPage + pageRange, totalPages);

    return (
        <>
            <Heading />
            <section className="w-full bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] mt-28" style={{
                backgroundImage: 'url(http://localhost:8070/images/oceans.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',   // 원하는 너비 설정
                zIndex: 0,
                marginTop: '100px'
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
                                            onClick={() => { logCheck(`/RcommunityView/${post.rnum}`) }}
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
    
            {/* 페이지 네비게이션 */}
            <div className="flex justify-center mt-4">
                <ul className="flex items-center space-x-1 text-base">
                    <li>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - pageRange); }}
                            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage < pageRange ? 'cursor-not-allowed bg-gray-300' : ''}`}
                            aria-disabled={currentPage < pageRange}
                        >
                            <span className="sr-only">10 Pages Back</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-player-track-prev" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M21 5v14l-8 -7z" />
                                <path d="M10 5v14l-8 -7z" />
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${page === 1 ? 'cursor-not-allowed bg-gray-300' : ''}`}
                            aria-disabled={page === 1}
                        >
                            <span className="sr-only">Previous</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-player-skip-back" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M20 5v14l-12 -7z" />
                                <path d="M4 5l0 14" />
                            </svg>
                        </a>
                    </li>
                    {[...Array(endPage - startPage)].map((_, index) => {
                        const pageNumber = startPage + index;
                        return (
                            <li key={pageNumber}>
                                <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); handlePageChange(pageNumber); }}
                                    className={`flex items-center justify-center px-4 h-10 leading-tight ${currentPage === pageNumber ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} rounded-md`}
                                    aria-current={currentPage === pageNumber ? 'page' : undefined}
                                >
                                    {pageNumber + 1}
                                </a>
                            </li>
                        );
                    })}
                    <li>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage >= totalPages - 1 ? 'cursor-not-allowed bg-gray-300' : ''}`}
                            aria-disabled={currentPage >= totalPages - 1}
                        >
                            <span className="sr-only">Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-player-skip-forward" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M4 5v14l12 -7z" />
                                <path d="M20 5l0 14" />
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + pageRange); }}
                            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage >= totalPages - pageRange ? 'cursor-not-allowed bg-gray-300' : ''}`}
                            aria-disabled={currentPage >= totalPages - pageRange}
                        >
                            <span className="sr-only">10 Pages Forward</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-track-next" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M3 5v14l8 -7z" />
        <path d="M14 5v14l8 -7z" />
      </svg>
                        </a>
                    </li>
                </ul>
            </div>
            <Footer />
        </>
    );
}
export default MyRequest;
