import React, { useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

function RePwd() {
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userid');


    async function onSubmit() {
        if (pwd == '') { return alert('비밀번호를 입력하세요'); }
        if (pwd !== pwdChk) { return alert('비밀번호 확인이 일치하지 않습니다'); }
        try {
            let result = await axios.post(`/api/member/RePwd/`,{userId,pwd});
            if (result.data.msg === 'yes') {
                alert('비밀번호 변경이 완료되었습니다');
                return navigate('/');
            } else {
                return alert('변경 실패 또는 다른 오류가 발생했습니다.');
            }
        } catch (error) {
            // 에러 정보를 콘솔에 출력합니다.
            console.error("Error during API call:", error.message || error);
            alert('요청 처리 중 오류가 발생했습니다.');
        }
    }

    return (
        <>
            <div className="loginform" style={{ marginTop: '80px' }}>
                <div className="flex items-center justify-center">
                    <div
                        className="border text-card-foreground w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#1e90ff]">비밀번호 변경</h2>
                        </div>
                        <form className="space-y-4">
                            <div className="space-y-2 text-left">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    새 비밀번호
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="비밀번호 입력"
                                    value={pwd} onChange={
                                        (e) => { setPwd(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    새 비밀번호 확인
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="비밀번호 확인"
                                    value={pwdChk} onChange={
                                        (e) => { setPwdChk(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" onClick={() => { onSubmit() }}>
                                변경하기
                            </button>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" onClick={() => { navigate('/') }}>
                                돌아가기
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RePwd