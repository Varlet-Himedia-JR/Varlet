import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';

import { setCookie, getCookie} from "../../util/cookieUtil";

import '../../style/mystargram.css'

function Login() {
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    let lUser = useSelector(state=>state.user)
    const dispatch = useDispatch();  // 쓰기를 위한 함수 생성
    const navigate = useNavigate();
    async function onLoginLocal(){
        if(!email){return alert("이메일을 입력하세요");}
        if(!pwd){return alert("패스워드를 입력하세요");}
        try{
            const result = await axios.post('/api/member/loginlocal', null,{params: {username:email,password:pwd}})
            if( result.data.error == 'ERROR_LOGIN'){
                return alert("이메일 또는 패스워드 오류입니다",result.data.error);
            }else{
                console.log(result.data);
                dispatch(loginAction(result.data));
                setCookie("user",JSON.stringify(result.data),1);
                navigate('/')
            }
            
        }catch(err){ console.error(err)}
    }

    return (
        <div className="loginform">
            <div className='field'>
                <label>E-MAIL</label>
                <input type="text" value={email} onChange={(e)=>{ setEmail(e.currentTarget.value) }}/>
            </div>
            <div className='field'>
                <label>PASSWORD</label>
                <input type="password" value={pwd} onChange={(e)=>{ setPwd(e.currentTarget.value) }}/>
            </div>
            <div className='btns'>
                <button onClick={ ()=>{ onLoginLocal() } }>LOGIN</button>
                <button onClick={ ()=>{ navigate('/join') } }>JOIN</button>
            </div>
            <div className='snslogin'>
                <button onClick={()=>{
                    window.location.href='http://localhost:8070/member/kakaostart';
                }}>KAKAO</button>
                <button>NAVER</button>
                <button>GOOGLE</button>
                <button>FACEBOOK</button>
            </div>
        </div>
    )
}

export default Login
