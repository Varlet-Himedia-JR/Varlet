import React, {useEffect, useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";


const locationData = {
  2: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"], 
  3: ["중구", "서구", "동구", "영도구", "부산진구", "동래구", "남구", "북구", "강서구", "해운대구", "사하구", "금정구", "연제구", "수영구", "사상구", "기장군"], 
  4: ["중구", "동구", "서구", "남구", "북구", "수성구", "달서구", "달성군", "군위군"], 
  5: ["중구", "동구", "미추홀구", "연수구", "남동구", "부평구", "계양구", "서구", "강화군", "옹진군"], 
  6: ["동구", "서구", "남구", "북구", "광산구"], 
  7: ["동구", "중구", "서구", "유성구", "대덕구"], 
  8: ["중구", "남구", "동구", "북구", "울주군"], 
  9: ["조치원읍", "연기면", "연동면", "부강면", "금남면", "장군면", "연서면", "전의면", "전동면", "소정면", "한솔동", "새롬동", "나성동", "도담동", "어진동", "해밀동", "아름동", "종촌동", "고운동", "소담동", "반곡동", "보람동", "대평동", "다정동"], 
  10: ["수원시", "성남시", "의정부시", "안양시", "부천시", "광명시", "평택시", "동두천시", "안산시", "고양시", "과천시", "구리시", "남양주시", "오산시", "시흥시", "군포시", "의왕시", "하남시", "용인시", "파주시", "이천시", "안성시", "김포시", "화성시", "광주시", "양주시", "포천시", "여주시", "연천군", "가평군", "양평군"], 
  11: ["춘천", "원주", "강릉", "동해", "태백", "속초", "삼척", "홍천", "영월", "평창", "정선", "철원", "화천", "양구", "인제", "고성", "양양"], 
  12: ["청주", "충주", "제천", "보은", "옥천", "영동", "증평", "진천", "괴산", "음성", "단양"], 
  13: ["천안", "공주", "보령", "앗나", "서산", "논산", "계룡", "당진", "금산", "부여", "서천", "청양", "홍성", "예산", "태안"], 
  14: ["전주", "익산", "군산", "정읍", "남원", "김제", "무주", "완주", "부안", "고창", "임실", "순창", "진안", "장수"], 
  15: ["목포", "여수", "순천", "나주", "광양", "담양", "곡성", "구례", "고흥", "보성", "화순", "장흥", "강진", "해남", "영암", "무안", "함평", "영광", "장성", "완도", "진도", "신안"], 
  16: ["포항", "경주", "김천", "안동", "구미", "영주", "영천", "상주", "문경", "경산", "의성", "청송", "영양", "영덕", "청도", "고령", "성주", "칠곡", "예천", "봉화", "울진", "울릉"], 
  17: ["창원", "김해", "양산", "진주", "거제", "통영", "사천", "밀양", "함안", "거창", "창녕", "고성", "하동", "합천", "남해", "함양", "신창", "의령"], 
  18: ["제주도", "서귀포시"]
};

const WritePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [reward, setReward] = useState('');
  const [userPoint, setUserPoint] = useState(0);  
  const navigate = useNavigate();
  const loginUser = useSelector(state => state.user);
  const userCookie = getCookie('user');

  useEffect(() => {
    if (userCookie) {
      axios.get(`/api/user/point?userid=${userCookie.userid}`)
        .then(response => {
          setUserPoint(response.data.point);
        })
        .catch(error => {
          console.error('Failed to fetch user point:', error);
        });
    }
  }, [userCookie]);
    

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
    setLocation2('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    axios.post('/api/rcommunity/writePost', { title, content, location, location2, reward })
      .then(response => {
        console.log('글 작성 성공:', response);
        alert('의뢰 성공');
      })
      .catch(error => {
        console.error('글 작성 실패:', error);
        alert('의뢰 실패');
      });
  };

  return (
    <div>
      <h1>글 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className='gnb'>  
          {getCookie('user')? (<h2>{getCookie('user').snsid}</h2>) : null}
        </div>
        <div>
          <label htmlFor="title">제목</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="location">지역</label>
          <select
            id="location"
            value={location}
            onChange={handleLocationChange}
            required
          >
            <option value="1">지역을 선택하세요</option>
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
        <div>
          <label htmlFor="location2">상세지역</label>
          <select
            id="location2"
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
            required
          >
            <option value="">상세지역을 선택하세요</option>
            {(locationData[location] || []).map((loc, index) => (
              <option key={index} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="content">의뢰 내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <div id='hp' htmlFor="reward">보유 포인트:{userPoint}</div>
          
          <div id='pp' htmlFor="reward">설정 포인트</div>
          <input
            id="reward"
            type="number"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            required
          />
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  );
}

export default WritePost;
