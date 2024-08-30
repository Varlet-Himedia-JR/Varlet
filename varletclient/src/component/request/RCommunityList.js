import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { location1Data, location2Data } from '../request/LocaionData';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import { cookies } from 'next/headers';
import userSlice from '../../store/userSlice';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [isLocation2Visible, setIsLocation2Visible] = useState(false);
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1); // 현재 페이지 상태 추가
  const [size, setSize] = useState(10); // 페이지 당 게시물 수 상태 추가
  const [totalCount, setTotalCount] = useState(0); // 전체 게시물 수 상태 추가
  const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, [page, size]); // page와 size 상태 변경 시마다 fetchPosts 호출

  const fetchPosts = () => {
    const params = { page, size };
    if (location) params.location = location;
    if (location2) params.location2 = location2;

    axios.get('/api/rcommunity/getPostList', { params })
      .then(response => {
        setPosts(response.data.postlist);
        setTotalCount(response.data.paging.totalCount); // 전체 게시물 수 설정
        setTotalPages(Math.ceil(response.data.paging.totalCount / size)); // 전체 페이지 수 계산
        console.log("tkdlwm?", page);
        console.log("tkdlwm?", totalPages);
        console.log("데이터? ", response.data.postlist);
        console.log("유저정보?",setCookie.userid)
      })
      .catch(error => console.error('Error fetching posts:', error));
};


  const searchPosts = () => {
    setPage(1); // 새로운 검색 시 첫 페이지로 설정
    setSearching(true);
    fetchPosts();
    setIsLocation2Visible(true);
  };

  const searchPostsByLocation2 = () => {
    if (location && location2) {
      setPage(1); // 새로운 검색 시 첫 페이지로 설정
      fetchPosts();
    }
  };

  const cancelSearch = () => {
    setLocation('');
    setLocation2('');
    setIsLocation2Visible(false);
    setSearching(false);
    setPage(1); // 검색 취소 시 첫 페이지로 설정
    fetchPosts();
  };

  const maskeduser = (user) => {
    // user는 객체로 되어 있어야 함
    if (user && typeof user.userid === 'string') {
        const userid = user.userid;
        // 앞 두 글자 + 별 3개
        if (userid.length > 2) {
            return userid.slice(0, 2) + '*'.repeat(3);
        }
        // 아이디 길이가 2 이하일 경우 모든 문자를 별로 대체
        return '*'.repeat(userid.length);
    }
    return '정보 없음';
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

  const handleLocationChange = (e) => {
    setLocation(parseInt(e.target.value, 10));
    setLocation2('');
    setIsLocation2Visible(false);
  };

  const handleLocation2Change = (e) => {
    setLocation2(parseInt(e.target.value, 10));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(totalPages, page + 2);

  return (
    <>
      <Heading />

      <div className='w-full max-w-[1500px] mx-auto px-1 mt-[80px]'>
      <div className="bg-white bg-opacity-90 p-8  shadow-lg  h-[1250px] mt-100px">
        <div className='mt-4 mb-5'>
          <div className='flex justify-between items-baseline h-20'>
            <h1 className='text-3xl font-semibold pb-5'>의뢰 게시판</h1>
          </div>
          <div className='w-full h-full'>
            <ul className='mb-4'>
              <li className='flex items-center mb-8 h-25'>
                <span className='mr-4 text-xl font-medium '>지역 선택</span>
                <select
                  className='border rounded px-2 py-1 h-10 font-bold font-lg'
                  value={location}
                  onChange={handleLocationChange}>
                  <option value="1">전체</option>
                  <option value="2">서울특별시</option>
                  <option value="3">부산광역시</option>
                  <option value="4">대구광역시</option>
                  <option value="5">인천광역시</option>
                  <option value="6">광주광역시</option>
                  <option value="7">대전광역시</option>
                  <option value="8">울산광역시</option>
                  <option value="9">세종특별자치시</option>
                  <option value="10">경기도</option>
                  <option value="11">강원도</option>
                  <option value="12">충청북도</option>
                  <option value="13">충청남도</option>
                  <option value="14">전라북도</option>
                  <option value="15">전라남도</option>
                  <option value="16">경상북도</option>
                  <option value="17">경상남도</option>
                  <option value="18">제주도</option>
                </select>
                <div className="flex ml-auto space-x-4 ">
                  <div
                    className="bg-customblue text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-700"
                    onClick={searchPosts}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                    <span className="text-xl font-bold">검색</span>
                  </div>

                  {searching && (
                    <div
                      className='bg-customblue text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-700'
                      onClick={cancelSearch}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5.039 5.062a7 7 0 0 0 9.91 9.89m1.584 -2.434a7 7 0 0 0 -9.038 -9.057" />
                        <path d="M3 3l18 18" />
                      </svg>
                      <span className="text-xl font-bold">검색 취소</span>
                    </div>
                  )}

                  <div 
                    className="bg-customblue text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-700"
                    onClick={ ()=>{ logCheck('/rpostwrite') } }
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                      <path d="M13.5 6.5l4 4" />
                    </svg>
                    <span className="text-xl font-bold">의뢰하기</span>
                  </div>
                </div>
              </li>

              {isLocation2Visible && (
                <li className='flex items-center mb-4 font-bold font-lg'>
                  <span className='mr-4 text-xl font-medium'>지역 상세</span>
                  <select
                    className='border rounded px-2 py-1 h-10'
                    value={location2}
                    onChange={handleLocation2Change}
                  >
                    {location2Data[location]?.map((loc) => (
                      <option key={loc.value} value={loc.value}>{loc.label}</option>
                    ))}
                  </select>
                  <div 
                    className="ml-auto bg-customblue text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer hover:bg-blue-200 dark:hover:bg-gray-700"
                    onClick={searchPostsByLocation2}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                      <path d="M21 21l-6 -6" />
                    </svg>
                    <span className="text-xl font-bold"> 상세검색</span>
                  </div>
                </li>
              )}
            </ul>
          </div>
        </div>

          <ul>
            <li className='flex font-bold justify-center items-center text-black border-b border-gray-300 pb-2 mb-2 h-20 text-lg'>
              <span className='w-1/12 text-center'>번호</span>
              <span className='w-4/12 text-left'>제목</span>
              <span className='w-2/12 text-center'>지역</span>
              <span className='w-2/12 text-center'>상세 지역</span>
              <span className='w-2/12 text-center'>작성자</span>
              <span className='w-2/12 text-center'>작성일</span>
              <span className='w-2/12 text-center'>채택 여부</span>
              <span className='w-1/12 text-center'>조회수</span>
            </li>
            {posts.length > 0 ? (
              posts.map((post, index) => (
                <li key={post.rnum} className='flex items-center justify-center border-b border-gray-300 py-2 h-20'>
                  <span className='w-1/12 text-center bg-blue-500 text-white rounded-full px-2 py-1 text-lg'>
                    {post.rnum}
                  </span>                  
                  <span className='w-4/12 text-left cursor-pointer text-blue-500 text-lg' onClick={ ()=>{ logCheck(`/RcommunityView/${post.rnum}`) } }>
                    {post.title}[{post.replyCount}]
                  </span>
                  <span className='w-2/12 text-center text-lg'>{location1Data[post.location]}</span>
                  <span className='w-2/12 text-center text-lg'>
                    {location2Data[post.location]?.find(item => item.value === post.location2)?.label || "전체"}
                  </span>
                  <span className="w-2/12 text-center text-lg">{maskeduser(post.userid)}</span>
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
                          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
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
            ) : (
              <li className="w-full text-center p-4">게시물이 없습니다.</li>
            )}
          </ul>

        <div className="mt-4 flex justify-center">
        <ul className="flex items-center space-x-1 h-20 text-base">
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handlePageChange(page - 10); }}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${page <= 10 ? 'cursor-not-allowed bg-gray-300' : ''}`}
            aria-disabled={page <= 10}
          >
            <span className="sr-only">10 Pages Back</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-track-prev" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M21 5v14l-8 -7z" />
        <path d="M10 5v14l-8 -7z" />
      </svg>
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handlePageChange(page - 1); }}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 ${page === 1 ? 'cursor-not-allowed bg-gray-300' : ''}`}
            aria-disabled={page === 1}
          >
            <span className="sr-only">Previous</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-skip-back" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M20 5v14l-12 -7z" />
        <path d="M4 5l0 14" />
            </svg>
          </a>
        </li>
        {Array.from({ length: endPage - startPage + 1 }, (_, index) => (
          <li key={startPage + index}>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); handlePageChange(startPage + index); }}
              className={`flex items-center justify-center px-4 h-10 leading-tight ${page === startPage + index ? 'text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'} rounded-md`}
              aria-current={page === startPage + index ? 'page' : undefined}
            >
              {startPage + index}
            </a>
          </li>
        ))}
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handlePageChange(page + 1); }}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${page === totalPages ? 'cursor-not-allowed bg-gray-300' : ''}`}
            aria-disabled={page === totalPages}
          >
            <span className="sr-only">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-player-skip-forward" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 5v14l12 -7z" />
        <path d="M20 5l0 14" />
      </svg>
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); handlePageChange(page + 10); }}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 ${page >= totalPages - 10 ? 'cursor-not-allowed bg-gray-300' : ''}`}
            aria-disabled={page >= totalPages - 10}
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
      </div>
      </div>
      <Footer />
    </>
  );
}

export default PostList;
