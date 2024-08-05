import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 훅을 사용

function PostList() {
  const [posts, setPosts] = useState([]);
  const [selectedOption, setSelectedOption] = useState('1');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    axios.get(`/api/rcommunity/getPostList`)
      .then(response => {
        setPosts(response.data.postlist);
        console.log("데이터옴?");
        console.log("posts."+posts.length);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, [selectedOption]);

  const obfuscateUserId = (userid) => {
    return userid.length > 2 ? userid.slice(0, 2) + '****' : userid;
  };

  // 글 작성 페이지로 이동하는 함수
  const requestwrite = () => {
    navigate('/rpostwrite'); // 글 작성 페이지로 이동
  };

  return (
    <div>
      <h1>게시글 목록</h1>
      <div>
        <label htmlFor="my-select">지역 선택</label>&nbsp;&nbsp;&nbsp;
        <select
          id="my-select"
          value={selectedOption}
          onChange={handleChange}
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
        <button onClick={requestwrite}>의뢰하기</button>
      </div>
      {/* <ul>
        {posts.map(post => (
          <li key={post.rnum}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>작성자: {obfuscateUserId(post.userid)}</p>
            <p>작성일: {post.writedate}</p>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default PostList;
