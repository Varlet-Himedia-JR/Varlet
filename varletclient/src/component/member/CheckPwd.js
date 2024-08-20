import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import { loginAction } from '../../store/userSlice';
import jaxios from '../../util/jwtUtil';

import { setCookie, getCookie } from "../../util/cookieUtil";

import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import '../../style/login.css';

function CheckPwd() {
    const [pwd, setPwd] = useState('');
    let lUser = useSelector(state => state.user)
    const dispatch = useDispatch();  // 쓰기를 위한 함수 생성
    const navigate = useNavigate();
    async function pwdCheck() {
        if (!pwd) { return alert("패스워드를 입력하세요"); }
        try {
            const result = await jaxios.post('/api/member/pwdCheck', null, { params: { userid: getCookie('user').userid, password: pwd } })
            if (result.data.msg == 'no') {
                return alert("패스워드 오류입니다");
            }else if(result.data.msg == 'yes'){
                alert('ㅎㅇ');
                navigate('/myINFO');
            }
        } catch (err) { console.error(err) }
    }



    return (
        <>
            <Heading />
            <div style={{ paddingTop: '100px' }}>
                <div className='background'><img src="http://localhost:8070/images/oceans.jpg" /></div>
            </div>
            <div className="loginform" style={{ paddingTop: '100px' }}>
                <div className='loginlabel'>{getCookie('user').userid}의 비번찾기</div>
                
                <div className='field'>
                    <label>비밀번호</label>
                    <input type="password" value={pwd} onChange={(e) => { setPwd(e.currentTarget.value) }} />
                </div>
                <div className='btns'>
                    <button onClick={() => { pwdCheck() }}>찾자~</button>
                    <button onClick={() => { navigate('/') }}>목록으로</button>
                </div>
                <div className='findbtn'>
                    <button onClick={() => { navigate('/findId') }}>아이디 찾기</button>
                    <button onClick={() => { navigate('/join') }}>비밀번호 찾기</button>
                </div>
                
            </div>
            <Footer />
        </>
    )
}

export default CheckPwd
