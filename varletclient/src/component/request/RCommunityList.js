import React, { useState,useEffect } from 'react'

import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";

export default function PostList() {
  const [posts, setPosts] = useState([]);  // 초기값을 빈 배열로 설정
  const [selectedOption, setSelectedOption] = useState('1');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  useEffect(() => {
    axios.get(`/api/rcommunity/getPostList`)
      .then(response => {
        setPosts(response.data.postlist || []); 
        console.log("데이터옴?");
        console.log("posts:", response.data.postlist);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, [selectedOption]);

  const maskedid = (userid) => {
    return userid.length > 2 ? userid.slice(0, 2) + '****' : userid;
  };

  const requestwrite = () => {
    navigate('/rpostwrite'); // 글 작성 페이지로 이동
  };


  return (
    <div className="mx-auto w-full max-w-5xl p-4">
  <header className="mb-4 flex items-center justify-between">
    <h1 className="text-2xl font-bold">의뢰게시판</h1>
    <a href="#" className="text-sm text-gray-500"> 글 작성하기 </a>
  </header>
  <nav className="mb-4 flex space-x-4 border-b">
    <a href="#" className="border-b-2 border-black pb-2"> 모든 게시글 </a>
    <a href="#" className="pb-2 text-gray-500"> 지역 선택 </a>
  </nav>
  <table className="w-full text-left">
    <thead>
      <tr className="border-b">
        <th className="py-2">no.</th>
        <th className="py-2">[분류] 제목</th>
        <th className="py-2">닉네임(작성자)</th>
        <th className="py-2">작성일</th>
        <th className="py-2">추천수</th>
        <th className="py-2">조회수</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b">
        <td className="py-2">104</td>
        <td className="py-2">[잡담] 열네 번째 글입니다.</td>
        <td className="py-2">user2</td>
        <td className="py-2">2024-06-10 17:37:22.0</td>
        <td className="py-2">9</td>
        <td className="py-2">0</td>
      </tr>
      <tr className="border-b">
        <td className="py-2">84</td>
        <td className="py-2">[고민] 열네 번째 글입니다.</td>
        <td className="py-2">user2</td>
        <td className="py-2">2024-06-10 17:37:18.0</td>
        <td className="py-2">9</td>
        <td className="py-2">0</td>
      </tr>
      <tr className="border-b">
        <td className="py-2">64</td>
        <td className="py-2">[고민] 열네 번째 글입니다.</td>
        <td className="py-2">user2</td>
        <td className="py-2">2024-06-10 17:37:14.0</td>
        <td className="py-2">9</td>
        <td className="py-2">0</td>
      </tr>
      <tr className="border-b">
        <td className="py-2">44</td>
        <td className="py-2">[고민] 열네 번째 글입니다.</td>
        <td className="py-2">user2</td>
        <td className="py-2">2024-06-10 17:37:09.0</td>
        <td className="py-2">9</td>
        <td className="py-2">0</td>
      </tr>
      <tr className="border-b">
        <td className="py-2">14</td>
        <td className="py-2">[고민] 열네 번째 글입니다.</td>
        <td className="py-2">user2</td>
        <td className="py-2">2024-06-03 09:25:07.0</td>
        <td className="py-2">9</td>
        <td className="py-2">0</td>
      </tr>
    </tbody>
  </table>
</div>

  );
}
