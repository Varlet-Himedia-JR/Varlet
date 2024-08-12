import React, {useState, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { loginAction, setFollowers, setFollowings } from '../../store/userSlice';

import { setCookie } from '../../util/cookieUtil';

function Naversaveinfo() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {nickname} = useParams();

    useEffect(
        ()=>{
            console.log(nickname);
            axios.post('/api/member/loginlocal', null, {params:{username:nickname, password:'naver'}} )
            .then((result=>{
                if( result.data.error == 'ERROR_LOGIN' ){
                    return alert("이메일 또는 패스워드 오류입니다");
                }else{
                    console.log('naveruser', result.data );
                    dispatch( loginAction( result.data ) );
                    setCookie("user", JSON.stringify(result.data), 1);
                    navigate('/')
                }
            }))
            .catch((err)=>{
                console.error(err);
            })
            
        },[]
    )
  return (
    <div></div>
  )
}

export default Naversaveinfo