import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // API를 호출하여 게시글 데이터를 가져옴
    axios.get('/api/rcommunity')
      .then(response => {
        setPosts(response.data);
      })
      .catch(error => {
        console.error('Error fetching posts:', error);
      });
  }, []);

  return (
    <div>
      <h1>게시글 목록</h1>
      <ul>
        {posts.map(post => (
          <li key={post.rnum}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>작성자: {post.userid}</p>
            <p>작성일: {post.writedate}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PostList;