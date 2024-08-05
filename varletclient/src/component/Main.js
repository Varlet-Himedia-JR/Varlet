import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
// import { loginAction, setFollowers, setFollowings } from '../store/userSlice';
import { loginAction, logoutAction } from '../store/userSlice';
import jaxios from '../util/jwtUtil';

import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";

// import '../style/mystargram.css'
function Main() {
  const [loginUser, setLoginUser] = useState({});
  const lUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function logout() {
    dispatch(logoutAction());
    removeCookie("user");
    alert('로그아웃되었습니다');
    navigate('/');
  }

  useEffect(
    ()=>{
        if(!lUser.email){
            alert('로그인이 필요합니다');
            navigate('/');
        }
        
        let cookieUser = getCookie('user');
        console.log( 'cookieUser : ',  cookieUser );
        console.log('luser : ',lUser);
        
        // axios.get(`/api/post/getPostList`, 
        //     {
        //     params:{word},headers : {'Authorization' : `Bearer ${lUser.accessToken}`}
        //     }
        // )

        // jaxios.get('/api/post/getPostList',{params:{word}})
        // .then((result)=>{
        //     setPostList( result.data.postlist);
        //     console.error('postlist', result.data.postlist);
        //     // setPaging( result.data.paging );
        // })
        // .catch((err)=>{console.error(err)})

        // 요청 메소드 별 header 에 인증용 JWT 토큰 받아서 보내는 법

        // post -> RequestBody
        // axios.post('/api',{name:name},{headers:{'Authorization':token}})

        // post -> RequestParam
        // axios.post('/api',null , {params: {name:name},headers:{'Authorization':token}})

        // * get 방식으로 요청할 경우 Body에 무언가를 담는 것이 불가능하다!
        // 따라서 get -> RequestBody는 불가능


        // get -> Requestbody 불가능

        // get -> RequestParam
        // axios.get('/api', {params: {name:name},headers:{'Authorization':token}})

        // put -> RequestBody
        // axios.post('/api', {name:name},{headers:{'Authorization':token}})

        // put -> RequestParam
        // axios.post('/api',null,{params: {name:name},headers:{'Authorization':token}})

        // delete
        // axios.post('/api',{ data:{name:name}, headers:{'Authorization':token}})

    },[]
)

  return (
    <div>
      <h1>Varlet lego</h1>
      {getCookie('user')?'':<button onClick={() => { navigate('/login') }}>Login</button>}
      <button onClick={() => { navigate('/qna') }}>Q&A</button>
      <button onClick={() => { navigate('/quest') }}>QUEST</button>
      <button onClick={() => { navigate('/review') }}>REVIEW</button>
      {getCookie('user')? (
        <h2>{getCookie('user').snsid}님 환영합니다</h2>
      ) : null}
      {getCookie('user')?<button onClick={() => { logout() }}>Logout</button>:''}
    </div>
  )
}

export default Main
