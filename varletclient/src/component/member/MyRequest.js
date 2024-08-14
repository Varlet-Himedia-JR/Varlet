import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import { getCookie } from '../../util/cookieUtil'; // 쿠키 유틸리티 함수 가져오기
import { useSelector } from 'react-redux';

// 예시 데이터 (실제 데이터로 교체 필요)
const location2Data = {
  1: [{ value: 0, label: "전체" }],
  2: [
    { value: 0, label: "전체" },
    { value: 1, label: "강남구" },
    { value: 2, label: "강동구" },
    { value: 3, label: "강북구" },
    { value: 4, label: "강서구" },
    { value: 5, label: "관악구" },
    { value: 6, label: "광진구" },
    { value: 7, label: "구로구" },
    { value: 8, label: "금천구" },
    { value: 9, label: "노원구" },
    { value: 10, label: "도봉구" },
    { value: 11, label: "동대문구" },
    { value: 12, label: "동작구" },
    { value: 13, label: "마포구" },
    { value: 14, label: "서대문구" },
    { value: 15, label: "서초구" },
    { value: 16, label: "성동구" },
    { value: 17, label: "성북구" },
    { value: 18, label: "송파구" },
    { value: 19, label: "양천구" },
    { value: 20, label: "영등포구" },
    { value: 21, label: "용산구" },
    { value: 22, label: "은평구" },
    { value: 23, label: "종로구" },
    { value: 24, label: "중구" },
    { value: 25, label: "중랑구" }
  ],
  3: [
    { value: 0, label: "전체" },
    { value: 1, label: "중구" },
    { value: 2, label: "서구" },
    { value: 3, label: "동구" },
    { value: 4, label: "영도구" },
    { value: 5, label: "부산진구" },
    { value: 6, label: "동래구" },
    { value: 7, label: "남구" },
    { value: 8, label: "북구" },
    { value: 9, label: "강서구" },
    { value: 10, label: "해운대구" },
    { value: 11, label: "사하구" },
    { value: 12, label: "금정구" },
    { value: 13, label: "연제구" },
    { value: 14, label: "수영구" },
    { value: 15, label: "사상구" },
    { value: 16, label: "기장군" }
  ],
  4: [
    { value: 0, label: "전체" },
    { value: 1, label: "중구" },
    { value: 2, label: "동구" },
    { value: 3, label: "서구" },
    { value: 4, label: "남구" },
    { value: 5, label: "북구" },
    { value: 6, label: "수성구" },
    { value: 7, label: "달서구" },
    { value: 8, label: "달성군" },
    { value: 9, label: "군위군" }
  ],
  5: [
    { value: 0, label: "전체" },
    { value: 1, label: "중구" },
    { value: 2, label: "동구" },
    { value: 3, label: "미추홀구" },
    { value: 4, label: "연수구" },
    { value: 5, label: "남동구" },
    { value: 6, label: "부평구" },
    { value: 7, label: "계양구" },
    { value: 8, label: "서구" },
    { value: 9, label: "강화군" },
    { value: 10, label: "옹진군" }
  ],
  6: [
    { value: 1, label: "전체" },
    { value: 2, label: "동구" },
    { value: 3, label: "서구" },
    { value: 4, label: "남구" },
    { value: 5, label: "북구" },
    { value: 6, label: "광산구" }
  ],
  7: [
    { value: 1, label: "전체" },
    { value: 2, label: "동구" },
    { value: 3, label: "중구" },
    { value: 4, label: "서구" },
    { value: 5, label: "유성구" },
    { value: 6, label: "대덕구" }
  ],
  8: [
    { value: 1, label: "전체" },
    { value: 2, label: "중구" },
    { value: 3, label: "남구" },
    { value: 4, label: "동구" },
    { value: 5, label: "북구" },
    { value: 6, label: "울주군" }
  ],
  9: [
    { value: 1, label: "전체" },
    { value: 2, label: "조치원읍" },
    { value: 3, label: "연기면" },
    { value: 4, label: "연동면" },
    { value: 5, label: "부강면" },
    { value: 6, label: "금남면" },
    { value: 7, label: "장군면" },
    { value: 8, label: "연서면" },
    { value: 9, label: "전의면" },
    { value: 10, label: "전동면" },
    { value: 11, label: "소정면" },
    { value: 12, label: "한솔동" },
    { value: 13, label: "새롬동" },
    { value: 14, label: "나성동" },
    { value: 15, label: "도담동" },
    { value: 16, label: "어진동" },
    { value: 17, label: "해밀동" },
    { value: 18, label: "아름동" },
    { value: 19, label: "종촌동" },
    { value: 20, label: "고운동" },
    { value: 21, label: "소담동" },
    { value: 22, label: "반곡동" },
    { value: 23, label: "보람동" },
    { value: 24, label: "대평동" },
    { value: 25, label: "다정동" }
  ],
  10: [
    { value: 1, label: "전체" },
    { value: 2, label: "수원시" },
    { value: 3, label: "성남시" },
    { value: 4, label: "의정부시" },
    { value: 5, label: "안양시" },
    { value: 6, label: "부천시" },
    { value: 7, label: "광명시" },
    { value: 8, label: "평택시" },
    { value: 9, label: "동두천시" },
    { value: 10, label: "안산시" },
    { value: 11, label: "고양시" },
    { value: 12, label: "과천시" },
    { value: 13, label: "구리시" },
    { value: 14, label: "남양주시" },
    { value: 15, label: "오산시" },
    { value: 16, label: "시흥시" },
    { value: 17, label: "군포시" },
    { value: 18, label: "의왕시" },
    { value: 19, label: "하남시" },
    { value: 20, label: "화성시" },
    { value: 21, label: "여주시" }
  ]
};

const location1Data = {
  1: ["전체"],
  2: ["서울"],
  3: ["부산"],
  4: ["대구"],
  5: ["인천"],
  6: ["광주"],
  7: ["대전"],
  8: ["울산"],
  9: ["세종"],
  10: ["경기도"]
};

function MyRequest() {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [isLocation2Visible, setIsLocation2Visible] = useState(false);
  const [searching, setSearching] = useState(false); // 추가된 상태
  const navigate = useNavigate();
  const userCookie = getCookie('user'); // 쿠키에서 사용자 ID 가져오기
  const loginUser = useSelector(state => state.user);

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = () => {
    axios.get('/api/rcommunity/getMyList')
      .then(response => setPosts(response.data.postlist))
      .catch(error => console.error('Error fetching posts:', error));
  };

  const searchPosts = () => {
    axios.get('/api/rcommunity/getMyList', {
      params: { location }
    })
    .then(response => {
      setPosts(response.data.postlist);
      setIsLocation2Visible(true);
      setSearching(true); // 검색 상태를 true로 설정
    })
    .catch(error => console.error('Error fetching posts:', error));
  };

  const searchPostsByLocation2 = () => {
    if (location && location2) {
      axios.get('/api/rcommunity/getMyList', {
        params: { location, location2 }
      })
      .then(response => setPosts(response.data.postlist))
      .catch(error => console.error('Error fetching posts:', error));
    }
  };

  const cancelSearch = () => {
    setLocation('');
    setLocation2('');
    setIsLocation2Visible(false);
    setSearching(false); // 검색 상태를 false로 설정
    fetchAllPosts(); // 모든 게시글 다시 불러오기
  };

  const maskedid = (userid) => {
    return userid.length > 2 ? userid.slice(0, 2) + '****' : userid;
  };

  const requestwrite = () => {
    navigate('/rpostwrite');
  };

  const RCommunityDetail = (postId) => {
    navigate(`/RcommunityDetail/${postId}`);
  };

  const handleLocationChange = (e) => {
    setLocation(parseInt(e.target.value)); // 숫자형으로 변환하여 저장
    setLocation2('');
    setIsLocation2Visible(false);
  };

  const handleLocation2Change = (e) => {
    setLocation2(parseInt(e.target.value));
  };

  return (
    <>
      <Heading />
      <div className='w-full max-w-[1700px] mx-auto px-1 mb-28' style={{ paddingTop: '100px' }}>
        <div className='mb-28'>
          <div className='flex justify-between items-baseline mb-28'>
            <h1 className='text-3xl font-semibold'>의뢰 게시판</h1>
          </div>
          <div className='w-full'>
            <ul className='mb-4'>
              <li className='flex items-center mb-4'>
                <span className='mr-4 text-lg font-medium'>지역 선택</span>
                <select
                  className='border rounded px-2 py-1'
                  value={location}
                  onChange={handleLocationChange}
                >
                  {Object.entries(location1Data).map(([key, value]) => (
                    <option key={key} value={key}>{value[0]}</option>
                  ))}
                </select>
                <div className="flex ml-auto space-x-4">
                  <div 
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer"
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
                    <button
                      className='bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer'
                      onClick={cancelSearch}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                        <path d="M5.039 5.062a7 7 0 0 0 9.91 9.89m1.584 -2.434a7 7 0 0 0 -9.038 -9.057" />
                        <path d="M3 3l18 18" />
                      </svg>
                      <span className="text-xl font-bold">검색 취소</span>
                    </button>
                  )}

                  <div 
                    className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer"
                    onClick={requestwrite}
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
                <li className='flex items-center mb-4'>
                  <span className='mr-4 text-lg font-medium'>지역 상세</span>
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
                </li>
              )}
            </ul>

            {/* 게시글 리스트 렌더링 부분 */}
            <div>
              {posts.length > 0 ? (
                <ul>
                  {posts.map(post => (
                    <li key={post.id} className='border-b p-4'>
                      <h2 className='text-xl font-bold cursor-pointer' onClick={() => RCommunityDetail(post.id)}>{post.title}</h2>
                      <p className='text-sm'>{maskedid(post.userid)}</p>
                      {/* 게시글의 추가적인 정보는 여기서 렌더링 */}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>게시글이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyRequest;
