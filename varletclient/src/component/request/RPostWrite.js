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
import { location1Data, location2Data } from '../request/LocaionData';



<script src="../path/to/flowbite/dist/flowbite.min.js"></script>

function RPostWritePost()  {
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

  jaxios.post('/api/rcommunity/writePost', {
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

export default RPostWritePost;