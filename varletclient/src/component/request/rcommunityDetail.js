import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import { getCookie } from '../../util/cookieUtil';

const location2Data = {
    1: [{ value: 0, label: "지역 선택" }],
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
  };

  function RCommunityDetail ()  {
    const { rnum } = useParams();
    const [post, setPost] = useState({});
    const [replyAllcount, setReplyAllcount] = useState(0);
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState(null);
  
    useEffect(() => {
      jaxios.get(`/api/rcommunity/rCommunityDetail/${rnum}`)
        .then((response) => {
          setPost(response.data.post);
          console.log(response.data.post);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [rnum]);
  
    const deleteCommunity = (rnum) => {
      if (window.confirm('정말로 삭제하시겠습니까?')) {
        jaxios.delete(`/api/rcommunity/rCommunityDelete/${rnum}`)
          .then(() => {
            navigate('/rcommunity');
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };
  
    const deleteCommunityReply = (grseq) => {
      if (window.confirm('정말로 삭제하시겠습니까?')) {
        jaxios.delete(`/api/rcommunity/deleteReply/${grseq}`)
          .then(() => {
            // 댓글 삭제 후 처리 로직
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };
  
    const returnList = () => {
      if (window.confirm('목록으로 돌아가시겠습니까?')) {
        navigate('/rcommunity');
      }
    };
  
    const rcommunityupdate = () => {
      navigate(`/rCommunityUpdate/${rnum}`);
    };
  
    const maskedid = (userid) => {
      if (typeof userid === 'string') {
        if (userid.length > 2) {
          return userid.slice(0, 2) + '*'.repeat(userid.length - 2);
        }
        return '*'.repeat(userid.length);
      }
      return '정보 없음';
    };
  
    const getLocationName = (location1, location2) => {
      const location1Name = location1Data[location1] ? location1Data[location1][0] : '정보 없음';
      const location2Options = location2Data[location1] || [];
      const location2Name = location2Options.find(option => option.value === location2)?.label || '정보 없음';
  
      return `${location1Name} - ${location2Name}`;
    };
  
    const getTravelDuration = (startDate, endDate) => {
      if (!startDate || !endDate) return '정보 없음';
  
      const start = new Date(startDate);
      const end = new Date(endDate);
  
      const diffTime = end - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffNights = diffDays + 1; // 시작일과 종료일 포함
  
      return `${diffNights}박 ${diffDays}일`;
    };

    const extractDate = (dateString) => {
      if (!dateString) return '';
    
      // 문자열의 앞 10글자만 반환
      return dateString.slice(0, 10);
    };

  
return (
      

<div class="w-full max-w-6xl mx-auto px-4 py-9">
  <div class="border-b pb-4 mb-6">
    <h1 class="text-3xl font-bold mb-2">{post.title}</h1>
    <div class="flex items-center text-muted-foreground text-sm">
      <div class="mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4 mr-1 inline-block"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        {maskedid(post.userid)}
      </div>
      <div class="mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4 mr-1 inline-block"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
        <span className='text-left'>
          작성일:
          {new Date(post.writedate).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
          }).replace(/\./g, '.').replace(/\.$/, '')}
        </span>
      </div>
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-4 h-4 mr-1 inline-block"
        >
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        {post.views}
      </div>
    </div>
    <div>
    <div class="flex items-center text-muted-foreground text-lg mb-4">
      <div class="mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-5 h-5 mr-1 inline-block"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
        <span className='text-left'>
                여행 시작일:
                {extractDate(post.startdate)}
                </span>
      </div>
      <div class="mr-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-5 h-5 mr-1 inline-block"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
        <span className='text-left'>
                여행 종료일:
                {extractDate(post.enddate)}

              </span>     
     </div>
    </div>
    <div class="ml-auto text-2xl font-bold mb-2">
    총 여행일수:{getTravelDuration(post.startdate,post.enddate)}
    </div>  
      <div class="mr-4 text-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="w-5 h-5 mr-1 inline-block"
        >
          <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
          <path d="M15 5.764v15"></path>
          <path d="M9 3.236v15"></path>
        </svg>
        여행 예상지: {getLocationName(post.location, post.location2)}
        </div>
        <div class="flex items-center text-muted-foreground text-sm">

        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moneybag" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z" />
          <path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
        </svg>
        포인트:{post.reward}
        </div>
    </div>
  </div>
  <div class="prose prose-lg">
  <div className="bg-gray-100 p-8 rounded-lg mb-8">
    <div className="text-lg leading-relaxed min-h-[40rem] w-full">
      <pre className="whitespace-pre-wrap">{post.content}</pre>
    </div>
  </div>
  </div>
  <div class="border-t pt-6 mt-6">
    <div class="flex justify-end gap-2 mb-4">
    <div className="flex items-center gap-2">
                {(post.userid === getCookie('user').userid) && (
                  <>
                    <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"                   
                     onClick={rcommunityupdate}
                    >
                      수정
                    </button>
                    <button
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                      onClick={() => deleteCommunity(post.rnum)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </div>
              <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  onClick={returnList}

              >
        목록으로
      </button>
    </div>
    <div class="border-b pb-4 mb-4">
      <textarea
        class="flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full mb-2"
        placeholder="Write a reply..."
      ></textarea>
      <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
        작성하기
      </button>
    </div>
    
    <div class="space-y-4">
      <div class="flex items-start gap-4">
        <span class="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
          <img class="aspect-square h-full w-full" alt="@shadcn" src="/placeholder-user.jpg" />
        </span>
        <div class="grid gap-1.5">
          <div class="flex items-center gap-2 text-sm">
            <div class="font-medium">Jane Doe</div>
            <div class="text-muted-foreground">2 days ago</div>
          </div>
          <p>
            Wow, your trip to Jeju Island sounds amazing! I've always wanted to visit and your photos and
            descriptions have made me even more excited to plan a trip there. The natural beauty and cultural
            richness of the island seem truly captivating.
          </p>
        </div>
      </div>
      <div class="flex items-start gap-4">
        <span class="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
          <img class="aspect-square h-full w-full" alt="@shadcn" src="/placeholder-user.jpg" />
        </span>
        <div class="grid gap-1.5">
          <div class="flex items-center gap-2 text-sm">
            <div class="font-medium">Michael Johnson</div>
            <div class="text-muted-foreground">1 week ago</div>
          </div>
          <p>I've been to Jeju Island a few times</p>
        </div>
      </div>
    </div>
  </div>
</div>

    );
  };
  
  export default RCommunityDetail;