import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';
import { setCookie, getCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';
import moment from 'moment';
import { location2Data } from '../request/LocaionData';
import Heading from '../headerfooter/Heading';

function RPostWritePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('1');
  const [location2, setLocation2] = useState('');
  const [reward, setReward] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const userCookie = getCookie('user');  // Assuming this is an object with `userid` and `point`

  const LocationChange = (e) => {
    setLocation(parseInt(e.target.value)); // 숫자형으로 변환하여 저장
    setLocation2('');
  };

  const handleLocation2Change = (e) => {
    setLocation2(parseInt(e.target.value));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  
    // 포인트 검증 추가
    if (parseInt(reward, 10) > userCookie.point) {
      alert('의뢰금은 보유 포인트를 초과할 수 없습니다.');
      return;
    }
  
    const location2Value = location2 === '' ? null : parseInt(location2, 10);
  
    // 요청 본문을 로깅하여 확인
    console.log({
      title: title, 
      content: content,
      location: parseInt(location, 10),
      location2: location2Value,
      reward: parseInt(reward, 10),
      userid: userCookie.userid, // 수정: userid만 전달
      startdate: startDate,
      enddate: endDate
    });
  
    jaxios.post(`/api/rcommunity/writePost`, {
      title: title,
      content: content,
      location: parseInt(location, 10),
      location2: location2Value,
      reward: parseInt(reward, 10),
      userid: userCookie.userid, // 수정: userid만 전달
      startdate: startDate,
      enddate: endDate
    })
    .then(response => {
      console.log('글 작성 성공:', response.data);
      alert('의뢰가 성공적으로 등록되었습니다.');
  
      // 서버 응답에서 업데이트된 유저 정보 받기
      // 포인트 차감 후 쿠키 업데이트
      setCookie('user', { ...userCookie, point: response.data.point});

      navigate('/rcommunity'); 
    })
    .catch(error => {
      console.error('글 작성 실패:', error.response ? error.response.data : error.message);
      alert('의뢰 등록에 실패했습니다.');
    });
  };
  

  useEffect(() => {
    if (location2Data[location]) {
      setLocation2(location2Data[location][0]?.value || '');
    } else {
      setLocation2('');
    }
  }, [location]);

  // const onInputChange = (event) => {
  //   const { name, value } = event.target;
  //   if (name === 'startDate') {
  //     setStartDate(value);
  //   } else if (name === 'endDate') {
  //     setEndDate(value);
  //   }
  // };

  const RewardChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setReward(value);
    } else {
      alert('숫자만 입력 가능합니다.');
    }
  };

  const today = new Date().toISOString().split('T')[0]; // 현재 날짜를 'YYYY-MM-DD' 형식으로

  const returnList = (event) => {
    if (window.confirm('작성을 취소하시겠습니까?')) {
      navigate('/rcommunity');  
    }
  };

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);

    if (endDate && moment(selectedStartDate).isAfter(moment(endDate))) {
      setEndDate(''); // 시작일을 변경했으므로 종료일을 초기화
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
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
        }}>
      <div className='w-full max-w-[1200px] mx-auto px-1 '>
      <div className="bg-white bg-opacity-90 p-8  shadow-lg  h-[1250px] mt-100px">
    <div className="flex justify-center">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-4xl" data-v0-t="card">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-1.5 p-6">
            <h1 className="whitespace-nowrap font-semibold tracking-tight text-4xl">여행 의뢰 작성</h1>
          </div>
          <div className="p-6 grid gap-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-4">
                <label className="font-medium text-lg" htmlFor="location">여행 예정지</label>
                <select className='border rounded px-2 py-1' value={location} onChange={LocationChange}>
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
              </div>
              <div className="grid gap-4">
                <label className="font-medium text-lg" htmlFor="sub-location">상세 지역</label>
                <select className='border rounded px-2 py-1' value={location2} onChange={handleLocation2Change}>
                  <option value="">전체</option>
                  {location2Data[location]?.map((loc) => (
                    <option key={loc.value} value={loc.value}>{loc.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="grid gap-4">
                <label className="font-medium text-lg" htmlFor="start-date">여행 시작일</label>
                <input
                  min={today}
                  type="date"
                  id="startDate"
                  name="startDate"
                  onChange={handleStartDateChange}
                  value={startDate}
                  required
                />
              </div>
              <div className="grid gap-4">
                <label className="font-medium text-lg" htmlFor="end-date">여행 종료일</label>
                <input
                  min={startDate ? moment(startDate).format('YYYY-MM-DD') : today}
                  type="date"
                  id="endDate"
                  name="endDate"
                  onChange={handleEndDateChange}
                  value={endDate}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4">
              <label className="font-medium text-lg" htmlFor="title">Title</label>
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-base"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목"
                required
              />
            </div>
            <div className="grid gap-4">
              <label className="font-medium text-lg" htmlFor="content">Content</label>
              <textarea
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[300px] text-base"
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용"
                required
              ></textarea>
            </div>
            <div className="grid gap-4">
              <label className="font-medium text-sm" htmlFor="points">보유 포인트: {userCookie.point}</label>
              <div className='flex items-center text-center justify-center'>
                <label className='font-medium'>의뢰금</label>
                <input
                  className="flex h-10 w-5/6 ml-2 rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-base"
                  type="number"
                  id="points"
                  value={reward}
                  onChange={RewardChange}
                  required
                  placeholder="보유 포인트를 초과할 수 없습니다."
                />
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium border border-input bg-white hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2  hover:bg-blue-200 dark:hover:bg-gray-700"
                onClick={returnList}
              >
                작성 취소
              </button>
              <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-white text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2  hover:bg-blue-200 dark:hover:bg-gray-700"
                type="submit"
              >
                작성 완료
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    </div>
    </div>
</section>
<Footer/>
</>
  );
}

export default RPostWritePost;
