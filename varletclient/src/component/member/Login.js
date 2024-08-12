import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';

import { setCookie, getCookie} from "../../util/cookieUtil";

import '../../style/mystargram.css'
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';

function Login() {
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    let lUser = useSelector(state=>state.user)
    const dispatch = useDispatch();  // 쓰기를 위한 함수 생성
    const navigate = useNavigate();
    async function onLoginLocal(){
        if(!userid){return alert("이메일을 입력하세요");}
        if(!pwd){return alert("패스워드를 입력하세요");}
        try{
            const result = await axios.post('/api/member/loginlocal', null,{params: {username:userid,password:pwd}})
            if( result.data.error == 'ERROR_LOGIN'){
                return alert("이메일 또는 패스워드 오류입니다",result.data.error);
            }else{
                console.log('login info',result.data);
                dispatch(loginAction(result.data));

                setCookie("user",JSON.stringify(result.data),1);
                navigate('/')
                console.log('login cookie info : ',getCookie('user'));

            }
            
        }catch(err){ console.error(err)}
    }

    return (
        <div>
        <Heading/>
        <div className="loginform">
            <div className='field'>
                <label>ID</label>
                <input type="text" value={userid} onChange={(e)=>{ setUserid(e.currentTarget.value) }}/>
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
                <button onClick={()=>{
                    window.location.href='http://localhost:8070/member/naverStart';
                }}>NAVER</button>
                <button>GOOGLE</button>
                <button>FACEBOOK</button>
            </div>
        </div>
        <Footer/>
        </div>
    )
}

export default Login
