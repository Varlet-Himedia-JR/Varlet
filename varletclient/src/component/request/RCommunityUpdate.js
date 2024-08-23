import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import moment from 'moment';


const locationData = {
  1: ["전체"] ,
  2: ["전체","강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"], 
  3: ["전체","중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "강서구", "해운대구", "사하구", "금정구", "연제구", "수영구", "사상구", "기장군"], 
  4: ["전체","중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"], 
  5: ["전체","중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"], 
  6: ["전체","동구", "서구", "남구", "북구", "광산구"], 
  7: ["전체","동구", "중구", "서구", "유성구", "대덕구"], 
  8: ["전체","중구", "남구", "동구", "북구", "울주군"], 
  9: ["전체","조치원읍", "연기면", "연동면", "부강면", "금남면", "장군면", "연서면", "전의면", "전동면", "소정면", "한솔동", "새롬동", "나성동", "도담동", "어진동", "해밀동", "아름동", "종촌동", "고운동", "소담동", "반곡동", "보람동", "대평동", "다정동"], 
  10: ["전체","수원시", "성남시", "의정부시", "안양시", "부천시", "광명시", "평택시", "동두천시", "안산시", "고양시", "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "용인시", "파주시", "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"], 
  11: ["전체","춘천", "원주", "강릉", "동해", "태백", "속초", "삼척", "홍천", "영월", "평창", "정선", "철원", "화천", "양구", "인제", "고성", "양양"], 
  12: ["전체","청주", "충주", "제천", "보은", "옥천", "영동", "증평", "진천", "괴산", "음성", "단양"], 
  13: ["전체","천안", "공주", "보령", "앗나", "서산", "논산", "계룡", "당진", "금산", "부여", "서천", "청양", "홍성", "예산", "태안"], 
  14: ["전체","전주", "익산", "군산", "정읍", "남원", "김제", "무주", "완주", "부안", "고창", "임실", "순창", "진안", "장수"], 
  15: ["전체","목포", "여수", "순천", "나주", "광양", "담양", "곡성", "구례", "고흥", "보성", "화순", "장흥", "강진", "해남", "영암", "무안", "함평", "영광", "장성", "완도", "진도", "신안"], 
  16: ["전체","포항", "경주", "김천", "안동", "구미", "영주", "영천", "상주", "문경", "경산", "의성", "청송", "영양", "영덕", "청도", "고령", "성주", "칠곡", "예천", "봉화", "울진", "울릉"], 
  17: ["전체","창원", "김해", "양산", "진주", "거제", "통영", "사천", "밀양", "함안", "거창", "창녕", "고성", "하동", "합천", "남해", "함양", "신창", "의령"], 
  18: ["전체","제주도", "서귀포시"]
};



function RCommunityUpdate() {
  const { rnum } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('1');
  const [location2, setLocation2] = useState('');
  const [reward, setReward] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    jaxios.get(`/api/rcommunity/rCommunityView/${rnum}`)
      .then((response) => {
        const post = response.data.post;
        setTitle(post.title);
        setContent(post.content);
        setLocation(post.location);
        setLocation2(post.location2);
        setReward(post.reward);
        setStartDate(post.startdate);
        setEndDate(post.enddate);
        console.log(response.data.post);
      })
      .catch((err) => {
        console.error('게시물 데이터를 불러오는 데 실패했습니다:', err);
      });
  }, [rnum]);

  const LocationChange = (event) => {
    const newLocation = event.target.value;
    setLocation(newLocation);
    setLocation2(locationData[newLocation] ? locationData[newLocation][0] : '');
  };

  const Location2Change = (event) => {
    setLocation2(event.target.value !== '전체' ? event.target.value : '');
  };


  const RewardChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setReward(value);
    } else {
      alert('숫자만 입력 가능합니다.');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const location2Value = location2 === '' ? null : parseInt(location2, 10);

    jaxios.post(`/api/rcommunity/rCommunityUpdate/${rnum}`, {
      title: title,
      content: content,
      location: parseInt(location, 10),
      location2: location2Value,
      reward: parseInt(reward, 10),
      startdate: startDate,
      enddate: endDate
      
    })
      .then(() => {
        alert('게시물이 성공적으로 수정되었습니다.');
        navigate(`/rCommunityView/${rnum}`);
      })
      .catch((err) => {
        console.error('게시물 수정에 실패했습니다:', err);
        alert('게시물 수정에 실패했습니다.');
      });
  };

  const returnList = () => {
    if (window.confirm('수정을 취소하시겠습니까?')) {
      navigate('/rcommunity');
    }
  };

  const today = new Date();

  moment(startDate).format('YYYY-MM-DD')

  const handleStartDateChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartDate(selectedStartDate);

    // 만약 새로운 시작일이 종료일 이후라면 종료일 초기화
    if (endDate && moment(selectedStartDate).isAfter(moment(endDate))) {
      setEndDate(''); // 시작일을 변경했으므로 종료일을 초기화
    }
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  return (
    <div class="flex justify-center">
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-4xl" data-v0-t="card">
    <form onSubmit={handleSubmit}>
      <div class="flex flex-col space-y-1.5 p-6">
        <h1 class="whitespace-nowrap font-semibold tracking-tight text-4xl">게시글 수정</h1>
      </div>
      <div class="p-6 grid gap-8">
        <div class="grid grid-cols-2 gap-6">
          <div class="grid gap-4">
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
              for="location"
            >
              여행 예정지
            </label>
            
            <select
              className='border rounded px-2 py-1'
              value={location}
              onChange={LocationChange}
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
          </div>
          <div class="grid gap-4">
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
              for="sub-location"
            >
              Sub-Location
            </label>
            <select
                className='border rounded px-2 py-1'
                value={location2}
                onChange={Location2Change}
              >
                {locationData[location]?.map((loc, index) => (
                  <option key={index} value={index}>{loc}</option>
                ))}
              </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="grid gap-4">
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
              for="start-date"
            >
              여행 시작일
            </label>
            <input
          min={today
            ? moment(startDate.dateTo).format('YYYY-MM-DD')
            :"yyyy-MM-dd"
          }
          type="date"
          id="startDate"
          name="startDate"
          onChange={handleStartDateChange}
          defaultValue={startDate ? startDate.slice(0, 10) : ""}
          required
        />
          </div>
          <div class="grid gap-4">
            <label
              class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
              for="end-date"
            >
              여행 종료일
            </label>
            <input
            min={startDate ? moment(startDate).format('YYYY-MM-DD') : today}
            type="date"
            id="enddate"
            name="enddate"
            onChange={handleEndDateChange}
            defaultValue={endDate ? endDate.slice(0, 10) : ""}
            required
          />
          </div>
        </div>
        <div class="grid gap-4">
          <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="title">
            Title
          </label>
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title for your post"
          />
        </div>
        <div class="grid gap-4">
          <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="content">
            Content
          </label>
          <textarea
            class="flex w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[300px] text-base"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write the content of your post here..."
          ></textarea>
        </div>
        <div class="grid gap-4">
          <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="points">
            포인트는 수정이 불가능합니다.
          </label>
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
            type="number"
            id="points"
            value={reward}
            onChange={RewardChange}
            readOnly
            placeholder="Enter points"
          />
        </div>
        <div class="flex justify-end gap-4">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          onClick={returnList}
          >
            수정 취소
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          type="submit"
          >
            수정 완료
          </button>
        </div>
      </div>
      </form>

    </div>
  </div>
  );
}

export default RCommunityUpdate;
