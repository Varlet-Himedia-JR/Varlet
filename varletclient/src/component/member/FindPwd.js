import React, {useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
function FindPwd() {

    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [storedCode , setStoredCode] = useState('');
    const navigate = useNavigate();
    const [isCode, setIsCode] = useState(false);

    
    async function onCode(){
        if(!name){return alert("이름을 입력하세요");}
        if(!email){return alert("이메일을 입력하세요");}
        try {
         await axios.post(`/api/member/findPwd/${email}` );
         setIsCode(true);
         return alert('인증번호가 전송되었습니다.');
        } catch (error) {
            console.error();
        }
    }

    async function onSubmit(){
        if(!storedCode){return alert("인증번호를 입력하세요");}
        try {
            let result = await axios.get(`/api/member/verifyCodeAndFindPwd/${email}/${storedCode}` );
            if (result.data.msg === 'yes') {
                // 인증 성공 후 서버에서 userid를 반환받아 비밀번호 변경 페이지로 전달합니다
                return navigate(`/rePwd?userid=${result.data.userid}`);
            } else {
                return alert('인증 실패 또는 다른 오류가 발생했습니다.');
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
                            <h2 className="text-2xl font-bold text-[#1e90ff]">비밀번호 찾기</h2>
                        </div>
                        <form className="space-y-4">
                            <div className="space-y-2 text-left">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    이름
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="이름 입력"
                                    value={name} onChange={
                                        (e) => { setName(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="space-y-2 text-left">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    이메일
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="이메일 입력"
                                    value={email} onChange={
                                        (e) => { setEmail(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-end justify-center">
                                <div className="flex items-center space-x-2">
                                    <a className="text-blue-500 cursor-pointer" onClick={() => { onCode() }}>
                                        인증번호 전송
                                    </a>
                                </div>
                            </div>
                            {isCode &&(<div className="space-y-2 text-left">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    인증번호
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="전송된 인증번호 입력"
                                    value={storedCode} onChange={
                                        (e) => { setStoredCode(e.currentTarget.value) }
                                    }
                                />
                            </div>)}

                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" onClick={() => { onSubmit() }}>
                                인증하기
                            </button>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" onClick={() => { navigate('/login') }}>
                                돌아가기
                            </button>
                        </form>
                    </div>
                </div>
            </div>
    </>
  )
}

export default FindPwd