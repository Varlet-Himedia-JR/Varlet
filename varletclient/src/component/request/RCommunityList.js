import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';

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
    { value: 20, label: "용인시" },
    { value: 21, label: "파주시" },
    { value: 22, label: "이천시" },
    { value: 23, label: "안성시" },
    { value: 24, label: "김포시" },
    { value: 25, label: "화성시" },
    { value: 26, label: "광주시" },
    { value: 27, label: "양주시" },
    { value: 28, label: "포천시" },
    { value: 29, label: "여주시" },
    { value: 30, label: "연천군" },
    { value: 31, label: "가평군" },
    { value: 32, label: "양평군" }
  ],
  11: [
    { value: 1, label: "전체" },
    { value: 2, label: "춘천" },
    { value: 3, label: "원주" },
    { value: 4, label: "강릉" },
    { value: 5, label: "동해" },
    { value: 6, label: "태백" },
    { value: 7, label: "속초" },
    { value: 8, label: "삼척" },
    { value: 9, label: "홍천" },
    { value: 10, label: "영월" },
    { value: 11, label: "평창" },
    { value: 12, label: "정선" },
    { value: 13, label: "철원" },
    { value: 14, label: "화천" },
    { value: 15, label: "양구" },
    { value: 16, label: "인제" },
    { value: 17, label: "고성" },
    { value: 18, label: "양양" }
  ],
  12: [
    { value: 1, label: "전체" },
    { value: 2, label: "청주" },
    { value: 3, label: "충주" },
    { value: 4, label: "제천" },
    { value: 5, label: "보은" },
    { value: 6, label: "옥천" },
    { value: 7, label: "영동" },
    { value: 8, label: "증평" },
    { value: 9, label: "진천" },
    { value: 10, label: "괴산" },
    { value: 11, label: "음성" },
    { value: 12, label: "단양" }
  ],
  13: [
    { value: 1, label: "전체" },
    { value: 2, label: "천안" },
    { value: 3, label: "공주" },
    { value: 4, label: "보령" },
    { value: 5, label: "아산" },
    { value: 6, label: "서산" },
    { value: 7, label: "논산" },
    { value: 8, label: "계룡" },
    { value: 9, label: "당진" },
    { value: 10, label: "금산" },
    { value: 11, label: "부여" },
    { value: 12, label: "서천" },
    { value: 13, label: "청양" },
    { value: 14, label: "홍성" },
    { value: 15, label: "예산" },
    { value: 16, label: "태안" }
  ],
  14: [
    { value: 1, label: "전체" },
    { value: 2, label: "전주" },
    { value: 3, label: "익산" },
    { value: 4, label: "군산" },
    { value: 5, label: "정읍" },
    { value: 6, label: "남원" },
    { value: 7, label: "김제" },
    { value: 8, label: "무주" },
    { value: 9, label: "완주" },
    { value: 10, label: "부안" },
    { value: 11, label: "고창" },
    { value: 12, label: "임실" },
    { value: 13, label: "순창" },
    { value: 14, label: "진안" },
    { value: 15, label: "장수" }
  ],
  15: [
    { value: 1, label: "전체" },
    { value: 2, label: "목포" },
    { value: 3, label: "여수" },
    { value: 4, label: "순천" },
    { value: 5, label: "나주" },
    { value: 6, label: "광양" },
    { value: 7, label: "담양" },
    { value: 8, label: "곡성" },
    { value: 9, label: "구례" },
    { value: 10, label: "고흥" },
    { value: 11, label: "보성" },
    { value: 12, label: "화순" },
    { value: 13, label: "장흥" },
    { value: 14, label: "강진" },
    { value: 15, label: "해남" },
    { value: 16, label: "영암" },
    { value: 17, label: "무안" },
    { value: 18, label: "함평" },
    { value: 19, label: "영광" },
    { value: 20, label: "장성" },
    { value: 21, label: "완도" },
    { value: 22, label: "진도" },
    { value: 23, label: "신안" }
  ],
  16: [
    { value: 1, label: "전체" },
    { value: 2, label: "포항" },
    { value: 3, label: "경주" },
    { value: 4, label: "김천" },
    { value: 5, label: "안동" },
    { value: 6, label: "구미" },
    { value: 7, label: "영주" },
    { value: 8, label: "영천" },
    { value: 9, label: "상주" },
    { value: 10, label: "문경" },
    { value: 11, label: "경산" },
    { value: 12, label: "의성" },
    { value: 13, label: "청송" },
    { value: 14, label: "영양" },
    { value: 15, label: "영덕" },
    { value: 16, label: "청도" },
    { value: 17, label: "고령" },
    { value: 18, label: "성주" },
    { value: 19, label: "칠곡" },
    { value: 20, label: "예천" },
    { value: 21, label: "봉화" },
    { value: 22, label: "울진" },
    { value: 23, label: "울릉" }
  ],
  17: [
    { value: 1, label: "전체" },
    { value: 2, label: "창원" },
    { value: 3, label: "김해" },
    { value: 4, label: "양산" },
    { value: 5, label: "진주" },
    { value: 6, label: "거제" },
    { value: 7, label: "통영" },
    { value: 8, label: "사천" },
    { value: 9, label: "밀양" },
    { value: 10, label: "함안" },
    { value: 11, label: "거창" },
    { value: 12, label: "창녕" },
    { value: 13, label: "고성" },
    { value: 14, label: "하동" },
    { value: 15, label: "합천" },
    { value: 16, label: "남해" },
    { value: 17, label: "함양" },
    { value: 18, label: "신창" },
    { value: 19, label: "의령" }
  ],
  18: [
    { value: 1, label: "전체" },
    { value: 2, label: "제주도" },
    { value: 3, label: "서귀포시" }
  ]
};


const location1Data = {
  1: ["전체"],
  2: ["서울특별시"],
  3: ["부산광역시"],
  4: ["대구광역시"],
  5: ["인천광역시"],
  6: ["광주광역시"],
  7: ["대전광역시"],
  8: ["울산광역시"],
  9: ["세종특별자치시"],
  10: ["경기도"],
  11: ["강원도"],
  12: ["충청북도"],
  13: ["충청남도"],
  14: ["전라북도"],
  15: ["전라남도"],
  16: ["경상북도"],
  17: ["경상남도"],
  18: ["제주도"]
};

function PostList() {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [isLocation2Visible, setIsLocation2Visible] = useState(false);
  const [searching, setSearching] = useState(false); // 추가된 상태
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const fetchAllPosts = () => {
    axios.get('/api/rcommunity/getPostList')
      .then(response => setPosts(response.data.postlist))
      .catch(error => console.error('Error fetching posts:', error));
  };

  const searchPosts = () => {
    axios.get('/api/rcommunity/getPostList', {
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
      axios.get('/api/rcommunity/getPostList', {
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
      <div className='w-full max-w-[1700px] mx-auto px-1 mb-28 '>
        <div className='mb-28 '> {/* 여기에 margin-bottom 추가 */}
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
                <div 
                  className="ml-auto bg-blue-300 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer"
                  onClick={searchPostsByLocation2}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                    <path d="M21 21l-6 -6" />
                  </svg>
                  <span className="text-lg font-bold">상세 검색</span>
                </div>
              </li>
            )}
          </ul>
          <ul>
            <li className='flex font-bold text-black border-b border-gray-300 pb-2 mb-2'>
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
              posts.map(post => (
                <li key={post.rnum} className='flex items-center border-b border-gray-300 py-2'>
                  <span className='w-1/12 text-center bg-blue-500 text-white rounded-full px-2 py-1 text-xs'>
                    {post.rnum}
                  </span>
                  <span className='w-4/12 text-left cursor-pointer text-blue-500' onClick={() => RCommunityDetail(post.rnum)}>
                    {post.title}
                  </span>
                  <span className='w-2/12 text-center'>{location1Data[post.location]}</span>
                  <span className='w-2/12 text-center'>
                    {location2Data[post.location]?.find(item => item.value === post.location2)?.label || "전체"}
                  </span>
                  <span className='w-2/12 text-center'>{maskedid(post.userid)}</span>
                  <span className='w-2/12 text-center'>
                    {new Date(post.writedate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\./g, '.').replace(/\.$/, '')}
                  </span>
                  <span className='w-2/12 text-center'>
                    {post.picked === "Y" ? "채택 완료" : (post.picked === "N" ? "채택 진행중" : "미정")}
                  </span>
                  <span className='w-1/12 text-center'>{post.views}</span>
                </li>
              ))
            ) : (
              <p className='text-center'>게시물이 없습니다.</p>
            )}
          </ul>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}

export default PostList;