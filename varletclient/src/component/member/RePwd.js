import React, {useState } from 'react'
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function RePwd() {

    const [pwd , setPwd] = useState('');
    const [pwdChk, setPwdChk ] = useState('');
    const navigate = useNavigate();


    async function onSubmit(){
        if(pwd==''){ return alert('비밀번호를 입력하세요');}
        if(pwd!==pwdChk){ return alert('비밀번호 확인이 일치하지 않습니다');}
        try {
            let result = await axios.post(`/api/member/RePwd/${pwd}` );
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
    <div className='RePwd'>
      <div className='RePwd_field'>
      </div>
      <div className='RePwd_field'>
            <label>새 비밀번호</label>
            <input type="password" value={pwd} onChange={
                (e)=>{ setPwd( e.currentTarget.value ) }
            }/>
        </div>

        <div className='RePwd_field'>
                <label>새 비밀번호 확인</label>
                <input type="password" value={pwdChk} onChange={
            (e)=>{ setPwdChk( e.currentTarget.value ) }
            }/>
        </div>

        <div className='RePwd_btn'>
            <button onClick={ ()=>{   onSubmit()    }  }>비밀번호 변경</button>
        </div>
    </div>
    </>
  )
}

export default RePwd