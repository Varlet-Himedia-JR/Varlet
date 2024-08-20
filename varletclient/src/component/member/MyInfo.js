import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import DaumPostcode from "react-daum-postcode";
import { useDispatch } from 'react-redux';
import jaxios from '../../util/jwtUtil';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import { logoutAction } from '../../store/userSlice';

function MyInfo() {
    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [dAddress, setDAddress] = useState('');
    const [profileimg, setProfileimg] = useState('');
    const [imgStyle, setImgStyle] = useState({ display: "none" });
    const [showPostcode, setShowPostcode] = useState(false);
    const [oldPwd, setOldPwd] = useState('');
    const [originalEmail, setOriginalEmail] = useState(''); // 이메일 중복 체크를 위한 상태
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Initialize state with userCookie values
        const userCookie = getCookie('user');
        if (userCookie) {
            setUserid(userCookie.userid || '');
            setOldPwd(userCookie.oldPwd || '');
            setPwd(userCookie.pwd || '');
            setPwdChk(userCookie.pwd || '');
            setName(userCookie.name || '');
            setEmail(userCookie.email || '');
            setNickname(userCookie.nickname || '');
            setPhone(userCookie.phone || '');
            setZipCode(userCookie.zipCode || '');
            setAddress(userCookie.address || '');
            setDAddress(userCookie.dAddress || '');
            setProfileimg(userCookie.profileimg || '');
            setOriginalEmail(userCookie.email || ''); // 쿠키에서 이메일 초기화
        }
    }, []);

    async function onSubmit() {
        const userCookie = getCookie('user');
        
        if (!oldPwd) return alert('현재 비밀번호를 입력하세요');
        if (pwd && pwd !== pwdChk) return alert('비밀번호 확인이 일치하지 않습니다');
        if (!name) return alert('이름을 입력하세요');
        if (!nickname) return alert('닉네임을 입력하세요');
        if (!email) return alert('이메일을 입력하세요');
        if (!phone) return alert('전화번호를 입력하세요');
        if (!dAddress) return alert('상세주소를 입력하세요');
        const userCookie = getCookie('user');
        try {
            // 서버에 현재 비밀번호 검증 요청
            // let pwdCheckResult = await jaxios.get('/api/member/pwdCheck', { params: { oldPwd, userid } });
            // if (pwdCheckResult.data.msg === 'no') return alert('현재 비밀번호가 일치하지 않습니다');
    
            // Check if email is duplicated when it's changed
            if (email !== originalEmail) {
                let emailCheckResult = await jaxios.get('/api/member/emailCheck', { params: { email } });
                if (emailCheckResult.data.msg === 'no') return alert('이메일이 중복됩니다');
            }
            // Send update request
            let updateResult = await jaxios.post('/api/member/updateInfo', {
                userid,
                pwd,
                name,
                nickname,
                email,
                phone,
                zipCode,
                address,
                dAddress,
                profileimg
            });

    
            if (updateResult.data.msg === 'ok') {
                if (window.confirm('수정이 완료되었습니다. 로그아웃 후 로그인 페이지로 이동합니다.')) {
                    dispatch(logoutAction());
                    removeCookie("user");
                    navigate('/login');
                }
            } else {
                alert('정보 수정 실패');
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류');
        }
    }


    async function fileupload(e) {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const result = await jaxios.post('/api/member/fileupload', formData);
            setProfileimg(`http://localhost:8070/uploads/${result.data.filename}`);
            setImgStyle({ display: "block", width: "200px" });
        } catch (err) {
            console.error(err);
            alert('파일 업로드 오류');
        }
    }

    const handlePostcodeComplete = (data) => {
        setZipCode(data.zonecode);
        setAddress(data.address);
        setShowPostcode(false);
    };

    return (
        <div className='loginform'>
            <div className="logo" style={{ fontSize: "2.0rem" }}>MY INFO EDIT</div>
            <div className='field'>
                <label>아이디</label>
                <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} disabled />
            </div>

            <div className='field'>
                <label>현재 비밀번호</label>
                <input
                    type="password"
                    onChange={(e) => setOldPwd(e.target.value)}
                    placeholder="현재 비밀번호 입력"
                />
            </div>
            <div className='field'>
                <label>비밀번호</label>
                <input
                    type="password"
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="비밀번호 입력"
                />
            </div>
            <div className='field'>
                <label>비밀번호 확인</label>
                <input
                    type="password"
                    onChange={(e) => setPwdChk(e.target.value)}
                    placeholder="비밀번호 확인 입력"
                />
            </div>
            <div className='field'>
                <label>이름</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='field'>
                <label>닉네임</label>
                <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            </div>
            <div className='field'>
                <label>이메일</label>
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='field'>
                <label>전화번호</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="field">
                <label>우편번호</label>
                <input type="text" style={{ flex: "2" }} value={zipCode} onChange={(e) => setZipCode(e.target.value)} readOnly />
                <button style={{ flex: "1" }} onClick={() => setShowPostcode(true)}>우편번호 찾기</button>
            </div>
            {showPostcode && (
                <div className="postcode-popup">
                    <DaumPostcode onComplete={handlePostcodeComplete} />
                </div>
            )}
            <div className="field">
                <label>주소</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} readOnly />
            </div>
            <div className="field">
                <label>상세주소</label>
                <input type="text" value={dAddress} onChange={(e) => setDAddress(e.target.value)} placeholder='상세주소 입력' />
            </div>
            <div className='field'>
                <label>프로필사진</label>
                <input type="file" onChange={fileupload} />
            </div>
            <div className='field'>
                <label>프로필사진 미리보기</label>
                <div><img src={profileimg} style={imgStyle} alt="프로필 미리보기" /></div>
            </div>
            <div className='btns'>
                <button onClick={onSubmit}>수정완료</button>
                <button onClick={() => navigate('/')}>돌아가기</button>
            </div>
        </div>
    );
}

export default MyInfo;
