import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import { setCookie, getCookie } from "../../util/cookieUtil";
import Heading from '../headerfooter/Heading';
import '../../style/login.css';

function Login() {
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const dispatch = useDispatch();  // 쓰기를 위한 함수 생성
    const navigate = useNavigate();
    async function onLoginLocal() {
        if (!userid) { return alert("이메일을 입력하세요"); }
        if (!pwd) { return alert("패스워드를 입력하세요"); }
        try {
            const result = await axios.post('/api/member/loginlocal', null, { params: { username: userid, password: pwd } })
            if (result.data.error == 'ERROR_LOGIN') {
                return alert("이메일 또는 패스워드 오류입니다", result.data.error);
            } else {
                console.log('login info', result.data);
                dispatch(loginAction(result.data));

                setCookie("user", JSON.stringify(result.data), 1);
                navigate('/')
                console.log('login cookie info : ', getCookie('user'));
            }
        } catch (err) { console.error(err) }
    }



    return (
        <>
            <Heading />
            {/* <div style={{ paddingTop: '100px' }}>
            <div className='background'><img src="http://localhost:8070/images/oceans.jpg"/></div>
        </div> */}
            {/* 
        <div className='loginlabel'>로그인</div>
                <div className='login_field'>
                    <label>아이디</label>
                    <input type="text" className='text' value={userid} onChange={(e) => { setUserid(e.currentTarget.value) }} />
                </div>
                <div className='login_field'>
                    <label>비밀번호</label>
                    <input type="password" value={pwd} onChange={(e) => { setPwd(e.currentTarget.value) }} />
                </div>
                <div className='btns'>
                    <button onClick={() => { onLoginLocal() }}>로그인</button>
                    <button onClick={() => { navigate('/join') }}>회원가입</button>
                </div>
                <div className='findbtn'>
                    <button onClick={() => { navigate('/findId') }}>아이디 찾기</button>
                    <button onClick={() => { navigate('/findPwd') }}>비밀번호 찾기</button>
                </div>
                <div className='snslogin'>
                    <div className='chat'><img src="http://localhost:8070/images/chat.png" /></div>
                    <button onClick={() => {
                        window.location.href = 'http://localhost:8070/member/kakaoStart';
                    }}>KAKAO 로그인</button>
                    <div className='naver'><img src="http://localhost:8070/images/naver.png" /></div>
                    <button onClick={() => {
                        window.location.href = 'http://localhost:8070/member/naverStart';
                    }}>NAVER 로그인</button>
                    <img style={{width:'40px'}} src='https://www.naver.com/favicon.ico'/>
                    <img style={{width:'40px'}} src='https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/kakaoService/cc08d9e2018e00001.png'/>
                </div>
        */}
            <div className="loginform" style={{ marginTop: '80px' }}>
                <div className="flex items-center justify-center">
                    <div
                        className="border text-card-foreground w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#1e90ff]">Varlet</h2>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full">
                                <img
                                    style={{ width: '30px' }}
                                    src="https://www.naver.com/favicon.ico"
                                    onClick={() => {
                                        window.location.href = 'http://localhost:8070/member/naverStart';
                                    }}
                                />
                            </button>
                            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 rounded-full">
                                <img
                                    style={{ width: '30px' }}
                                    src="https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/kakaoService/cc08d9e2018e00001.png"
                                    onClick={() => {
                                        window.location.href = 'http://localhost:8070/member/naverStart';
                                    }}
                                />
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div className="space-y-2 text-left"> {/* text-left 추가 */}
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    아이디
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={userid}
                                    onChange={(e) => {
                                        setUserid(e.currentTarget.value);
                                    }}
                                    placeholder="아이디 입력"
                                />
                            </div>
                            <div className="space-y-2 text-left"> {/* text-left 추가 */}
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    비밀번호
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={pwd}
                                    type="password"
                                    onChange={(e) => {
                                        setPwd(e.currentTarget.value);
                                    }}
                                    placeholder="비밀번호 입력"
                                />
                            </div>
                            <div className="flex items-end justify-end"> {/* justify-end로 우측 정렬 */}
                                <div className="flex items-center space-x-2">
                                    <a className="text-blue-500 cursor-pointer" onClick={() => { navigate('/findId') }}>
                                        아이디
                                    </a>
                                    &nbsp;혹은
                                    <a className="text-blue-500 cursor-pointer" onClick={() => { navigate('/findPwd') }}>비밀번호
                                    </a>&nbsp;를 잊어버리셨습니까?
                                    <input
                                        aria-hidden="true"
                                        tabIndex="-1"
                                        type="checkbox"
                                        value="on"
                                        style={{
                                            transform: 'translateX(-100%)',
                                            position: 'absolute',
                                            pointerEvents: 'none',
                                            opacity: 0,
                                            margin: 0,
                                            width: '16px',
                                            height: '16px',
                                        }}
                                    />
                                </div>
                            </div>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg"
                                onClick={(e) => { e.preventDefault(); onLoginLocal(); }}>
                                로그인
                            </button>

                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" onClick={() => { navigate('/join') }}>
                                회원가입
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Login
