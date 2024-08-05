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
    // API를 통해 게시글 작성 요청
    axios.post('/api/rcommunity/writePost', { title, content, location, location2, reward })
      .then(response => {
        console.log('글 작성 성공:', response);
        // 성공 후 적절한 처리 (예: 목록 페이지로 리다이렉트)
      })
      .catch(error => {
        console.error('글 작성 실패:', error);
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
          </select>
          <label htmlFor="location">상세지역</label>
          <select
            id="location"
            value={location2}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="1">전체</option>
            <option value="2">서울특별시</option>
          </select>
        </div>
        <div>
          <label htmlFor="reward">지역</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          >
            <option value="1">전체</option>
            <option value="2">서울특별시</option>
          </select>
          <label htmlFor="location">지역</label>
          
        </div>
        <button type="submit">제출</button>
      </form>
    </div>
  );
}

export default WritePost;
