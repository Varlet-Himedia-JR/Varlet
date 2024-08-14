import React ,{useState, useEffect} from 'react'
import axios from '../../util/jwtUtil'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';
import moment from 'moment';


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
<script src="../path/to/flowbite/dist/flowbite.min.js"></script>

function WritePost  ()  {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('1');
  const [location2, setLocation2] = useState('');
  const [reward, setReward] = useState('');
  const [userPoint, setUserPoint] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const navigate = useNavigate();
  const loginUser = useSelector(state => state.user);
  const userCookie = getCookie('user');

  useEffect(() => {
    if (userCookie) {
      jaxios.get(`/api/user/point?userid=${userCookie.userid}`)
        .then(response => {
          setUserPoint(response.data.point);
        })
        .catch(error => {
          console.error('사용자 포인트를 가져오는데 실패했습니다:', error);
        });
    }
  }, []);
  
//location 함수
const LocationChange = (e) => {
  setLocation(parseInt(e.target.value)); // 숫자형으로 변환하여 저장
  setLocation2('');
};

const handleLocation2Change = (e) => {
  setLocation2(parseInt(e.target.value));
};

const handleSubmit = (event) => {
  event.preventDefault();

  
  const location2Value = location2 === '' ? null : parseInt(location2, 10);

  axios.post('/api/rcommunity/writePost', {
    title: title,
    content: content,
    location: parseInt(location, 10),
    location2: location2Value, // int형으로 변환, 빈 문자열인 경우 null로 처리
    reward: parseInt(reward, 10),
    userid: userCookie.userid,
    startdate: startDate,
    enddate: endDate    // 추가
  })
  .then(response => {
    console.log('글 작성 성공:', response);
    alert('의뢰가 성공적으로 등록되었습니다.');
    navigate('/rcommunity'); 
  })
  .catch(error => {
    console.error('글 작성 실패:', error);
    alert('의뢰 등록에 실패했습니다.');
  });
};

  useEffect(() => {
    if (location2Data[location]) {
      setLocation2(location2Data[location][0] || '');
    } else {
      setLocation2('');
    }
  }, [location]);

  const onInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };

  const RewardChange = (event) => {
    const { value } = event.target;
    if (/^\d*$/.test(value)) {
      setReward(value);
    } else {
      alert('숫자만 입력 가능합니다.');
    }
  };

  const today = new Date();

  moment(startDate).format('YYYY-MM-DD')

  const returnList = (event) => {
    window.alert('작성을 취소하시겠습니까?')
    navigate('/rcommunity');  
  };



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
        <h1 class="whitespace-nowrap font-semibold tracking-tight text-4xl">여행 의뢰 작성</h1>
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
              상세 지역
            </label>
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
          value={startDate}
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
            id="endDate"
            name="endDate"
            onChange={handleEndDateChange}
            value={endDate}
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
            Points
          </label>
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
            type="number"
            id="points"
            value={reward}
            onChange={RewardChange}
            required
            placeholder="Enter points"
          />
        </div>
        <div class="flex justify-end gap-4">
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          onClick={returnList}
          >
            작성 취소
          </button>
          <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          type="submit"
          >
            작성 완료
          </button>
        </div>
      </div>
      </form>

    </div>
  </div>
);
};

export default WritePost;