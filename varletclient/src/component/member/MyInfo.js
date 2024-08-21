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
    const [d_address, setD_address] = useState('');
    const [profileimg, setProfileimg] = useState('');
    const [imgStyle, setImgStyle] = useState({ display: "none" });
    const [showPostcode, setShowPostcode] = useState(false);
    const [originalEmail, setOriginalEmail] = useState('');
    const [originalPwd, setOriginalPwd] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const userCookie = getCookie('user');
        console.log('userCookie:', userCookie);
        if (userCookie) {
            setUserid(userCookie.userid || '');
            setName(userCookie.name || '');
            setEmail(userCookie.email || '');
            setNickname(userCookie.nickname || '');
            setPhone(userCookie.phone || '');
            setZipCode(userCookie.zipCode);
            setAddress(userCookie.address);
            setD_address(userCookie.d_address || '');
            setProfileimg(userCookie.profileimg || '');
            setOriginalEmail(userCookie.email || '');
            setOriginalPwd(userCookie.pwd || ''); // 기존 비밀번호 설정
        }
    }, []);

    async function checkPassword() {
        try {
            const response = await jaxios.post('/pwdCheck', { userid, pwd });
            if (response.data.msg === 'yes') {
                return true;
            } else {
                alert('기존 비밀번호와 동일합니다. 새로운 비밀번호를 입력해주세요.');
                return false;
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류');
            return false;
        }
    }

    async function onSubmit() {
        // 비밀번호 및 비밀번호 확인 검사
        if (pwd || pwdChk) {
            if (!pwd) {
                return alert('비밀번호를 입력하세요');
            }
            if (!pwdChk) {
                return alert('비밀번호 확인칸을 작성해주세요');
            }
            if (pwd !== pwdChk) {
                return alert('비밀번호 확인이 일치하지 않습니다');
            }
    
            // 비밀번호가 입력된 경우에만 비밀번호 확인
            if (pwd === originalPwd) {
                const isNewPassword = await checkPassword();
                if (!isNewPassword) return; // 비밀번호가 기존과 동일할 경우
            }
        } else {
            // 비밀번호가 입력되지 않은 경우
            alert('비밀번호를 입력하세요');
            return; // 비밀번호 입력이 없으면 이후 로직을 실행하지 않음
        }
    
        // 이메일 중복 검사
        if (email !== originalEmail) {
            const isEmailUnique = await checkEmail();
            if (!isEmailUnique) return; // 이메일이 중복될 경우, 이후 로직을 실행하지 않음
        }
    
        // 비밀번호가 입력되었고 이메일 중복 검사가 통과된 경우에만 나머지 필드 검사 수행
        if (!name) {
            return alert('이름을 입력하세요');
        }
        if (!nickname) {
            return alert('닉네임을 입력하세요');
        }
        if (!email) {
            return alert('이메일을 입력하세요');
        }
        if (!phone) {
            return alert('전화번호를 입력하세요');
        }
        if (!d_address) {
            return alert('상세주소를 입력하세요');
        }
    
        try {
            // 정보 업데이트 요청
            let updateResult = await jaxios.post('/api/member/updateInfo', {
                userid,
                pwd,
                name,
                nickname,
                email,
                phone,
                zipCode,
                address,
                d_address,
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
    
    
    async function checkEmail() {
        try {
            const response = await jaxios.get('/api/member/checkEmail', { params: { email } });
            if (response.data.msg === 'no') {
                alert('이메일이 중복됩니다. 다른 이메일을 입력해주세요.');
                return false;
            }
            return true;
        } catch (err) {
            console.error('Error details:', err.response ? err.response.data : err.message);
            alert('서버 오류');
            return false;
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

    const openPostcodePopup = () => {
        window.open('/popup/postcode', '주소 찾기', 'width=500,height=402');
        window.addEventListener('message', function (event) {
          if (event.origin === window.location.origin) {
            const { zipCode, address } = event.data;
            console.log(zipCode);
            console.log(address);
            setZipCode(zipCode);
            setAddress(address);
          }
        });
      };

    return (
        <div className='loginform'>
            <div className="logo" style={{ fontSize: "2.0rem" }}>MY INFO EDIT</div>
            <div className='field'>
                <label>아이디</label>
                <input type="text" value={userid} onChange={(e) => setUserid(e.target.value)} disabled />
            </div>
            <div className='field'>
                <label>비밀번호</label>
                <input
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="비밀번호 입력"
                />
            </div>
            <div className='field'>
                <label>비밀번호 확인</label>
                <input
                    type="password"
                    value={pwdChk}
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
                <input type="text" style={{ flex: "2" }} value={zipCode} onChange={(e) => { setZipCode(e.target.value); }} readOnly />
                <button style={{ flex: "1" }} onClick={openPostcodePopup}>우편번호 찾기</button>
            </div>
            <div className="field">
                <label>주소</label>
                <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} readOnly />
            </div>
            <div className="field">
                <label>상세주소</label>
                <input type="text" value={d_address} onChange={(e) => setD_address(e.target.value)} placeholder='상세주소 입력' />
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
