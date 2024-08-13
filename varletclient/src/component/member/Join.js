import React, {useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
function Join() {

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk ] = useState('');
    const [name, setName ] = useState('');
    const [email,setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [dAddress, setDAddress] = useState('');
    const [profileimg, setProfileimg] = useState('');
    const [imgStyle, setImgStyle] = useState({display:"none"});
    const [showPostcode, setShowPostcode] = useState(false);



    const navigate = useNavigate();

    async function onSubmit(){
        if(userid==''){ return alert('아이디를 입력하세요');}
        if(pwd==''){ return alert('패스워드를 입력하세요');}
        if(pwd!==pwdChk){ return alert('패스워드 확인이 일치하지 않습니다');}
        if(name==''){ return alert('이름을 입력하세요');}
        if(nickname==''){ return alert('닉네임을 입력하세요');}
        if(email==''){ return alert('이메일을 입력하세요');}
        if(phone==''){ return alert('전화번호를 입력하세요');}
        if(dAddress==''){ return alert('상세주소를 입력하세요');}
        
        try{
            let result = await axios.post('/api/member/useridCheck', null, {params:{userid}} );
            if(result.data.msg == 'no' ){
                return alert('아이디가 중복됩니다');
            }

            result = await axios.post('/api/member/nicknameCheck', null, {params:{nickname}} );
            if(result.data.msg == 'no' ){
                return alert('닉네임이 중복됩니다');
            }

            result = await axios.post('/api/member/join', {userid, pwd, name,nickname,email,phone,zipCode,address,dAddress,profileimg });
            if(result.data.msg=='ok'){
                alert('회원 가입이 완료되었습니다. 로그인하세요');
                navigate('/');
            }
        }catch(err){
            console.error(err);
        }
    }

    async function fileupload(e){
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const result = await axios.post('/api/member/fileupload', formData);
        
        setProfileimg(`http://localhost:8070/uploads/${result.data.filename}`);
        console.log(result.data.filename);
        
        setImgStyle({display:"block", width:"200px"});
    }


    const handlePostcodeComplete = (data) => {
      setZipCode(data.zonecode);
      setAddress(data.address);
      setShowPostcode(false);
    };

    return (
        <>
        <Heading/>
        <div className='loginform'>

            <div className="logo" style={{fontSize:"2.0rem"}}>회원가입</div>
            <div className='field'>
                <label>아이디</label>
                <input type="text" value={userid} onChange={
                    (e)=>{ setUserid( e.currentTarget.value ) }
                } />
            </div>
            <div className='field'>
                <label>비밀번호</label>
                <input type="password" value={pwd} onChange={
                    (e)=>{ setPwd( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>비밀번호 확인</label>
                <input type="password" value={pwdChk} onChange={
                    (e)=>{ setPwdChk( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>이름</label>
                <input type="text"  value={name} onChange={
                    (e)=>{ setName( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>닉네임</label>
                <input type="text"  value={nickname} onChange={
                    (e)=>{ setNickname( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>이메일</label>
                <input type="text"  value={email} onChange={
                    (e)=>{ setEmail( e.currentTarget.value ) }
                }/>
            </div>
            <div className='field'>
                <label>전화번호</label>
                <input type="text" value={phone} onChange={
                    (e)=>{ setPhone( e.currentTarget.value ) }
                }/>
            </div>
            <div className="field">
                <label>우편번호</label>
                <input type="text"  style={{flex:"2"}} value={zipCode} onChange={(e)=>{
                     setZipCode( e.currentTarget.value );
                }} readOnly/>
                <button style={{ flex: "1" }} onClick={() => { setShowPostcode(true) }}>우편번호 찾기</button>
            </div>
            {showPostcode && (
                <div className="postcode-popup">
                    <DaumPostcode onComplete={handlePostcodeComplete} />
                </div>
            )}
            <div className="field" >
                <label>주소</label>
                <input type="text" value={address} onChange={
                      (e)=>{ setAddress( e.currentTarget.value ); }
                } readOnly/>
            </div>
            <div className="field">
                <label>상세주소</label>
                <input type="text" value={dAddress} onChange={
                      (e)=>{  setDAddress( e.currentTarget.value ); }
                } placeholder='상세주소 입력'/>
            </div>
            <div className='field'>
                <label>프로필사진</label>
                <input type="file" onChange={(e)=>{ fileupload(e) }}/>
            </div>
            <div className='field'>
                <label>프로필사진 미리보기</label>
                <div><img src={profileimg} style={imgStyle} /></div>
            </div>

            <div className='btns'>
                <button onClick={ ()=>{   onSubmit()    }  }>회원가입</button>
                <button onClick={ ()=>{ navigate('/')   }  }>돌아가기</button>
            </div>
        
        </div>
        <Footer/>
    </>
    )
}

export default Join