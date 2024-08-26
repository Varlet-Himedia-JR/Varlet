import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import { setCookie, getCookie} from "../../util/cookieUtil";
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import '../../style/login.css';
import { data } from 'autoprefixer';

function Login() {
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
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
        <>
        <Heading/>
        <div style={{ paddingTop: '100px' }}>
            <div className='background'><img src="http://localhost:8070/images/oceans.jpg"/></div>
        </div>
        <div className="loginform" style={{paddingTop: '100px'}}>
            <div className='loginlabel'>로그인</div>
            <div className='login_field'>
                <label>아이디</label>
                <input type="text" className='text'value={userid} onChange={(e)=>{ setUserid(e.currentTarget.value) }}/>
            </div>
            <div className='login_field'>
                <label>비밀번호</label>
                <input type="password" value={pwd} onChange={(e)=>{ setPwd(e.currentTarget.value) }}/>
            </div>
            <div className='btns'>
                <button onClick={ ()=>{ onLoginLocal() } }>로그인</button>
                <button onClick={ ()=>{ navigate('/join') } }>회원가입</button>
            </div>
            <div  className='findbtn'>
            <button onClick={ ()=>{ navigate('/findId') } }>아이디 찾기</button>
            <button onClick={ ()=>{ navigate('/join') } }>비밀번호 찾기</button>
            </div>
            <div className='snslogin'>
                <div className='chat'><img src="http://localhost:8070/images/chat.png"/></div>
                <button onClick={()=>{
                    window.location.href='http://localhost:8070/member/kakaoStart';
                }}>KAKAO 로그인</button>
                <div className='naver'><img src="http://localhost:8070/images/naver.png"/></div>
                <button onClick={()=>{
                    window.location.href='http://localhost:8070/member/naverStart';
                }}>NAVER 로그인</button>
            </div>
        </div>
        <Footer/>
        </>
    )
}

export default Login
