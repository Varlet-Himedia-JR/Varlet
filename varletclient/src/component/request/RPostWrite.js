import React, { useState, useEffect } from 'react';
import axios from 'axios';

const locations = {
  "1": { name: "전체", cities: ["전체"] },
  "2": { name: "서울특별시", cities: ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구"] },
  "3": { name: "부산광역시", cities: ["해운대구", "사하구", "동래구", ...] },
  "4": { name: "대구광역시", cities: ["달서구", "수성구", "북구", ...] },
  "5": { name: "인천광역시", cities: ["남동구", "부평구", "연수구", ...] },
  "6": { name: "광주광역시", cities: ["동구", "서구", "남구", ...] },
  "7": { name: "대전광역시", cities: ["유성구", "서구", "동구", ...] },
  "8": { name: "울산광역시", cities: ["남구", "동구", "북구", ...] },
  "9": { name: "세종특별자치시", cities: ["고운동", "아름동", "어진동", ...] },
  "10": { name: "경기도", cities: ["수원시", "성남시", "안양시", ...] },
  "11": { name: "강원도", cities: ["춘천시", "원주시", "강릉시", ...] },
  "12": { name: "충청북도", cities: ["청주시", "충주시", "제천시", ...] },
  "13": { name: "충청남도", cities: ["천안시", "아산시", "서산시", ...] },
  "14": { name: "전라북도", cities: ["전주시", "군산시", "익산시", ...] },
  "15": { name: "전라남도", cities: ["목포시", "여수시", "순천시", ...] },
  "16": { name: "경상북도", cities: ["포항시", "경주시", "김천시", ...] },
  "17": { name: "경상남도", cities: ["창원시", "진주시", "김해시", ...] },
  "18": { name: "제주도", cities: ["제주시", "서귀포시", "우도", ...] },
};


function WritePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('1');
  const [location2, setLocation2] = useState(locations["1"].cities[0]);
  const [reward, setReward] = useState('');

  useEffect(() => {
    setLocation2(locations[location].cities[0]);
  }, [location]);

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
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="location">지역</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            {Object.entries(locations).map(([key, value]) => (
              <option key={key} value={key}>{value.name}</option>
            ))}
          </select>
          <label htmlFor="location2">상세지역</label>
          <select
            id="location2"
            value={location2}
            onChange={(e) => setLocation2(e.target.value)}
            required
          >
            {locations[location].cities.map((city, index) => (
              <option key={index} value={city}>{city}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="reward">설정 포인트</label>
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
