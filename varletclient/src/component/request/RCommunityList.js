import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 예시 데이터 (실제 데이터로 교체 필요)
const location2Data = {
  1: ["전체"],
  2: ["전체", "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"],
  3: ["전체", "중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "강서구", "해운대구", "사하구", "금정구", "연제구", "수영구", "사상구", "기장군"],
  4: ["전체", "중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"],
  5: ["전체", "중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"],
  6: ["전체", "동구", "서구", "남구", "북구", "광산구"],
  7: ["전체", "동구", "중구", "서구", "유성구", "대덕구"],
  8: ["전체", "중구", "남구", "동구", "북구", "울주군"],
  9: ["전체", "조치원읍", "연기면", "연동면", "부강면", "금남면", "장군면", "연서면", "전의면", "전동면", "소정면", "한솔동", "새롬동", "나성동", "도담동", "어진동", "해밀동", "아름동", "종촌동", "고운동", "소담동", "반곡동", "보람동", "대평동", "다정동"],
  10: ["전체", "수원시", "성남시", "의정부시", "안양시", "부천시", "광명시", "평택시", "동두천시", "안산시", "고양시", "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "용인시", "파주시", "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"],
  11: ["전체", "춘천", "원주", "강릉", "동해", "태백", "속초", "삼척", "홍천", "영월", "평창", "정선", "철원", "화천", "양구", "인제", "고성", "양양"],
  12: ["전체", "청주", "충주", "제천", "보은", "옥천", "영동", "증평", "진천", "괴산", "음성", "단양"],
  13: ["전체", "천안", "공주", "보령", "앗나", "서산", "논산", "계룡", "당진", "금산", "부여", "서천", "청양", "홍성", "예산", "태안"],
  14: ["전체", "전주", "익산", "군산", "정읍", "남원", "김제", "무주", "완주", "부안", "고창", "임실", "순창", "진안", "장수"],
  15: ["전체", "목포", "여수", "순천", "나주", "광양", "담양", "곡성", "구례", "고흥", "보성", "화순", "장흥", "강진", "해남", "영암", "무안", "함평", "영광", "장성", "완도", "진도", "신안"],
  16: ["전체", "포항", "경주", "김천", "안동", "구미", "영주", "영천", "상주", "문경", "경산", "의성", "청송", "영양", "영덕", "청도", "고령", "성주", "칠곡", "예천", "봉화", "울진", "울릉"],
  17: ["전체", "창원", "김해", "양산", "진주", "거제", "통영", "사천", "밀양", "함안", "거창", "창녕", "고성", "하동", "합천", "남해", "함양", "신창", "의령"],
  18: ["전체", "제주도", "서귀포시"]
};

const location1Data={
  1: ["지역 선택"],
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

}

function PostList() {
  const [posts, setPosts] = useState([]);
  const [location, setLocation] = useState('1');
  const [location2, setLocation2] = useState('');
  const navigate = useNavigate();

  const getLocation1Name = (loc) => {
    return location1Data[loc] ?? '이러지마 제발~';
  };

  const getLocation2Name = (loc1, loc2) => {
    return location2Data[loc1]?.[loc2] ?? '전체';
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
    setLocation(e.target.value);
    setLocation2(''); // 지역 2를 초기화
  };

  const findList = () => {
    axios.get('/api/rcommunity/getPostList', {
      params: { location, location2 }
    })
    .then(response => {
      const data = response.data.postlist.map(post => ({
        ...post,
        location1Name: getLocation1Name(post.location),
        location2Name: getLocation2Name(post.location, post.location2)
      }));
      setPosts(data);
    })
    .catch(error => console.error('Error fetching posts:', error));
  };

  useEffect(() => {
    // 초기 로드 시 전체 게시글 불러오기
    findList();
  }, []);

  return (
    <div className='w-full max-w-7xl mx-auto px-4 mb-16'>
      <div className='flex justify-between items-baseline mb-16'>
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
              <option hidden value="0"></option>
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
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded'
              onClick={findList}
            >
              검색하기
            </button>
            <div className='ml-4'>
              <span className='mr-4 text-lg font-medium'>지역 상세</span>
              <select
                className='border rounded px-2 py-1'
                value={location2}
                onChange={(e) => setLocation2(e.target.value)}
              >
                {location2Data[location]?.map((loc, index) => (
                  <option key={index} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <button
              className='bg-blue-500 text-white px-4 py-2 rounded'
              onClick={findList}
            >
            상세 검색
            </button>
            
            <button
              className='ml-auto bg-blue-500 text-white px-4 py-2 rounded'
              onClick={requestwrite}
            >
              의뢰하기
            </button>
          </li>
        </ul>
        <ul>
          <li className='flex font-bold text-black border-b border-gray-300 pb-2 mb-2'>
            <span className='w-1/12 text-center'>번호</span>
            <span className='w-4/12 text-left'>제목</span>
            <span className='w-2/12 text-center'>지역1</span>
            <span className='w-2/12 text-center'>지역2</span>
            <span className='w-2/12 text-center'>작성자</span>
            <span className='w-2/12 text-left'>작성일</span>
            <span className='w-1/12 text-center'>조회수</span>
          </li>
          <div>
            {posts.length > 0 ? (
              posts.map(post => (
                <li key={post.rnum} className='flex items-center border-b border-gray-300 py-2'>
                  <span className='w-1/12 text-center bg-blue-500 text-white rounded-full px-2 py-1 text-xs'>
                    {post.rnum}
                  </span>
                  <span className='w-4/12 text-left cursor-pointer text-blue-500' onClick={() => RCommunityDetail(post.rnum)}>
                    {post.title}
                  </span>
                  <span className='w-2/12 text-center'>{getLocation1Name(post.location)}</span>
                  <span className='w-2/12 text-center'>{getLocation2Name(post.location, post.location2)}</span>
                  <span className='w-2/12 text-center'>{maskedid(post.userid)}</span>
                  <span className='w-2/12 text-left'>
                    {new Date(post.writedate).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    }).replace(/\./g, '.').replace(/\.$/, '')}
                  </span>
                  <span className='w-1/12 text-center'>{post.views}</span>
                </li>
              ))
            ) : (
              <p className='text-center py-4'>게시글이 없습니다.</p>
            )}
          </div>
        </ul>
      </div>
    </div>
  );
}

export default PostList;