import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import '../../style/join.css'
function Join() {

    const [userid, setUserid] = useState('');
    const [pwd, setPwd] = useState('');
    const [pwdChk, setPwdChk] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [zip_code, setZip_code] = useState('');
    const [address, setAddress] = useState('');
    const [d_address, setD_address] = useState('');
    const [profileimg, setProfileimg] = useState('');
    const [imgStyle, setImgStyle] = useState({ display: "none", width: "200px" });




    const navigate = useNavigate();

    useEffect(() => {
        const handlePostMessage = (event) => {
            if (event.origin === window.location.origin) {
                const { zip_code, address } = event.data;
                setZip_code(zip_code);
                setAddress(address);
            }
        };

        window.addEventListener('message', handlePostMessage);

        return () => {
            window.removeEventListener('message', handlePostMessage);
        };
    }, []);

    async function onSubmit() {
        if (userid == '') { return alert('아이디를 입력하세요'); }
        if (pwd == '') { return alert('비밀번호를 입력하세요'); }
        if (pwd !== pwdChk) { return alert('비밀번호 확인이 일치하지 않습니다'); }
        if (name == '') { return alert('이름을 입력하세요'); }
        if (nickname == '') { return alert('닉네임을 입력하세요'); }
        if (email == '') { return alert('이메일을 입력하세요'); }
        if (phone == '') { return alert('전화번호를 입력하세요'); }
        if (d_address == '') { return alert('상세주소를 입력하세요'); }
        try {
            let result = await axios.post('/api/member/useridCheck', null, { params: { userid } });
            if (result.data.msg == 'no') {
                return alert('아이디가 중복됩니다');
            }

            result = await axios.post('/api/member/nicknameCheck', null, { params: { nickname } });
            if (result.data.msg === 'no') {
                return alert('닉네임이 중복됩니다');
            }

            result = await axios.post('/api/member/join', { userid, pwd, name, nickname, email, phone, zip_code, address, d_address, profileimg });
            console.log(d_address);

            if (result.data.msg === 'ok') {

                alert('회원 가입이 완료되었습니다. 로그인하세요');
                navigate('/');
            }
        } catch (err) {
            console.error(err);
        }
    }


    async function fileupload(e) {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const result = await axios.post('/api/member/fileupload', formData);
        try {
            setProfileimg(`http://localhost:8070/uploads/${result.data.filename}`);
            console.log(result.data.filename);
            setImgStyle({ display: "block", width: "200px" });
        } catch {
            return;
        }
    }

    const openPostcodePopup = () => {
        const width = 500;
        const height = 402;
        const left = (window.screen.width / 2) - (width / 2);
        const top = (window.screen.height / 2) - (height / 2);

        window.open('/popup/postcode', '주소 찾기', `width=${width},height=${height},left=${left},top=${top}`);
    };





    return (
        <>
            <Heading />
            <div className="joinform" style={{ marginTop: '80px' }}>
                <div className="flex items-center justify-center">
                    <div
                        className="border text-card-foreground w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
                    >
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-[#1e90ff]">회원가입</h2>
                        </div>
                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault();}}>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    아이디
                                </label>
                                <input
                                    className="flex h-10 w-4/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="아이디 입력"
                                    value={userid} onChange={
                                        (e) => { setUserid(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    비밀번호
                                </label>
                                <input
                                    className="flex h-10 w-3/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="비밀번호 입력"
                                    type="password"
                                    value={pwd} onChange={
                                        (e) => { setPwd(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    비밀번호 확인
                                </label>
                                <input
                                    className="flex h-10 w-3/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="비밀번호 입력"
                                    type="password"
                                    value={pwdChk} onChange={
                                        (e) => { setPwdChk(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    이름
                                </label>
                                <input
                                    className="flex h-10 w-4/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="이름 입력"
                                    value={name} onChange={
                                        (e) => { setName(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    닉네임
                                </label>
                                <input
                                    className="flex h-10 w-4/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="닉네임 입력"
                                    value={nickname} onChange={
                                        (e) => { setNickname(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    이메일
                                </label>
                                <input
                                    className="flex h-10 w-4/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="이메일 입력"
                                    value={email} onChange={
                                        (e) => { setEmail(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    전화번호
                                </label>
                                <input
                                    className="flex h-10 w-4/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="전화번호 입력"
                                    value={phone} onChange={
                                        (e) => { setPhone(e.currentTarget.value) }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    우편번호
                                </label>
                                <input
                                    className="flex h-10 w-2/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="우편번호 입력"
                                    value={zip_code} onChange={(e) => { setZip_code(e.currentTarget.value); }} readOnly
                                />
                                <button onClick={openPostcodePopup} className="w-2/5 h-10 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg">우편번호 찾기</button>
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    주소
                                </label>
                                <input
                                    className="flex h-10 w-4/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50flex items-center space-x-2flex items-center space-x-2flex items-center space-x-2flex items-center space-x-2"
                                    placeholder="주소 입력"
                                    value={address} onChange={
                                        (e) => { setAddress(e.currentTarget.value); }
                                    } readOnly
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    상세주소
                                </label>
                                <input
                                    className="flex h-10 w-4/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="상세주소 입력"
                                    value={d_address} onChange={
                                        (e) => { setD_address(e.currentTarget.value); }
                                    }
                                />
                            </div>
                            <div className="flex items-center space-x-2 justify-between">
                                <label
                                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-bold"
                                >
                                    프로필사진
                                </label>
                                <input type="file" onChange={(e) => { fileupload(e) }} />
                            </div>
                            <div className='w-full'>
                                <div>
                                    <img
                                        src={profileimg}
                                        style={imgStyle}
                                        onError={() => console.error('Failed to load image:', profileimg)}
                                    />
                                </div>
                            </div>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" onClick={() => { onSubmit() }}>
                                회원가입
                            </button>
                            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" onClick={() => { navigate('/') }}>
                                돌아가기
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Join;