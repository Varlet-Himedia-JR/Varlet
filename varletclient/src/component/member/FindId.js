import React, {useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
function FindId() {
    
    const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [storedCode , setStoredCode] = useState('');
    const navigate = useNavigate();

    
    async function onCode(){
        if(!name){return alert("이름을 입력하세요");}
        if(!email){return alert("이메일을 입력하세요");}
        try {
         await axios.post(`/api/member/findId/${email}` );
         return alert('인증번호가 전송되었습니다.');
        } catch (error) {
            console.error();
        }
    }

    async function onSubmit(){
        if(!storedCode){return alert("인증번호를 입력하세요");}
        try {
            let result = await axios.get(`/api/member/verifyCodeAndFindId/${email}/${storedCode}` );
            if (result.data.msg === 'yes') {
                return alert('회원님의 아이디는 ' + result.data.userid + '입니다.');
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
    <Heading/>
    <div style={{ paddingTop: '100px' }}>
            <div className='background'><img src="http://localhost:8070/images/oceans.jpg"/></div>
        </div>
    <div className='loginform' >
        <div className='loginlabel'>아이디 찾기</div>
        <div className='login_field'>
            <label>이름</label>
            <input type="text"  value={name} onChange={
                (e)=>{ setName( e.currentTarget.value ) }
            }/>
        </div>
        <div className='login_field'>
            <label>이메일</label>
            <input type="text"  value={email} onChange={
                (e)=>{ setEmail( e.currentTarget.value ) }
            }/>
        </div>
        <div className='login_field'>
            <label>인증번호</label>
            <input type="text"  value={storedCode} onChange={
                (e)=>{ setStoredCode( e.currentTarget.value ) }
            }/>
            <button onClick={ ()=>{   onCode()    }  }>인증번호 받기</button>
        </div>
        
        <div className='btns'>
                <button onClick={ ()=>{   onSubmit()    }  }>인증하기</button>
                <button onClick={ ()=>{ navigate('/')   }  }>돌아가기</button>
            </div>
    </div>
    <Footer/>
    </>
  )
}

export default FindId