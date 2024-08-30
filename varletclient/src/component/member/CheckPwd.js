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
            if (result.data.msg === 'no') {
                return alert("패스워드 오류입니다");
            } else if (result.data.msg === 'yes') {
                // alert('정보 수정 페이지로 이동합니다');
                navigate('/myINFO');
            }
        } catch (err) { console.error(err) }
    }

    return (
        <>
            <Heading />
            <div className="loginform" style={{ marginTop: '80px' }}>
                <div className="flex items-center justify-center">
                    <div
                        className="border text-card-foreground w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#1e90ff]">비밀번호 찾기</h2>
                        </div>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); pwdCheck(); }}>
                            <div className="space-y-2 text-left">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    비밀번호
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="비밀번호 입력"
                                    type="password"
                                    value={pwd} onChange={(e) => { setPwd(e.currentTarget.value) }}
                                />
                            </div>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" type="submit">
                                인증하기
                            </button>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" type="button" onClick={() => { navigate('/') }}>
                                돌아가기
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CheckPwd
