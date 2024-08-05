import React, { useState } from 'react';
import axios from 'axios';

function WritePost() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [location2, setLocation2] = useState('');
  const [reward, setReward] = useState('');

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
          <label >제목</label>
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
          <label htmlFor="location2">상세지역</label>
          <select
            id="location2"
            value={location2}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="1">전체</option>
            <option value="2">서울특별시</option>
            
          </select>
        </div>
        <div>
          
          <label htmlFor="location">설정 포인트</label>
          
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  );
}

export default WritePost;
