import React, { useState, useEffect } from 'react'
import axios from '../../util/jwtUtil'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';
import moment from 'moment';
import { location1Data, location2Data } from '../request/LocaionData';



<script src="../path/to/flowbite/dist/flowbite.min.js"></script>

function ContentsWrite() {
    const [cname, setCname] = useState('');
    const [ctype, setCtype] = useState('축제');
    const [location, setLocation] = useState('1');
    const [location2, setLocation2] = useState('');
    const [cstart_time, setCstart_time] = useState('');
    const [cend_time, setCend_time] = useState('');
    const [cost, setCost] = useState('');
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const userCookie = getCookie('user');
    const [contentsimg, setContentsimg] = useState('');
    const [imgStyle, setImgStyle] = useState({ display: "none" });

    async function fileupload(e) {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const result = await axios.post('/api/member/fileupload', formData);

        setContentsimg(`http://localhost:8070/uploads/${result.data.filename}`);
        console.log(result.data.filename);

        setImgStyle({ display: "block", width: "200px" });
    }






    // async function handleSubmit(){
    //     try {
    //         let result = await jaxios.post('/api/contents/writeContents', {
    //             ctype: ctype,
    //             cname: cname,
    //             location: location,
    //             location2: location2,
    //             cstart_time: cstart_time,
    //             cend_time: cend_time,
    //             cost: cost,
    //             contentsimg: contentsimg
    //         })
    //         if (result.data.msg == 'ok') {
    //             alert('등록 완료');
    //             navigate('/contents');
    //         }
    //     }

    // }

    async function handleSubmit() {
        // if (cname == '') { return alert('콘텐츠명을 입력하세요'); }
        // if (cost == '') { return alert('비용을 입력하세요'); }
        // if (contentsimg == '') { return alert('이미지를 등록하세요'); }

        // try {
        //     let result = await axios.post('/api/contents/writeContents', {
        //         ctype: ctype,
        //         cname: cname,
        //         location: location,
        //         location2: location2,
        //         cstart_time: cstart_time,
        //         cend_time: cend_time,
        //         cost: cost,
        //         contentsimg: contentsimg
        //     });


        //     // result = await axios.post('/api/member/nicknameCheck', null, {params:{nickname}} );
        //     // if(result.data.msg == 'no' ){
        //     //     return alert('닉네임이 중복됩니다');
        //     // }

        //     result = await axios.post('/api/contents/writeContents', {
        //         ctype: ctype,
        //         cname: cname,
        //         location: location,
        //         location2: location2,
        //         cstart_time: cstart_time,
        //         cend_time: cend_time,
        //         cost: cost,
        //         contentsimg: contentsimg
        //     });
        //     if (result.data.msg == 'ok') {
        //         alert('회원 가입이 완료되었습니다. 로그인하세요');
        //         navigate('/');
        //     }
        // } catch (err) {
        //     console.error(err);
        // }
        console.log({
            ctype: ctype,
            cname: cname,
            location: location,
            location2: location2,
            cstart_time: cstart_time,
            cend_time: cend_time,
            cost: cost,
            contentsimg: contentsimg
        });
        alert('---해치웠나?---');
        
    }

    useEffect(() => {
        if (location2Data[location]) {
            setLocation2(location2Data[location][0] || '');
        } else {
            setLocation2('');
        }
    }, [location]);

    const onInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'startDate') {
            setCstart_time(value);
        } else if (name === 'endDate') {
            setCend_time(value);
        }
    };

    const today = new Date();

    moment(cstart_time).format('YYYY-MM-DD')

    const returnList = (event) => {
        if (window.confirm('작성을 취소하시겠습니까?')) {
            navigate('/contents');
        }
    };



    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setCstart_time(selectedStartDate);

        // 만약 새로운 시작일이 종료일 이후라면 종료일 초기화
        if (cend_time && moment(selectedStartDate).isAfter(moment(cend_time))) {
            setCend_time(''); // 시작일을 변경했으므로 종료일을 초기화
        }
    };

    const handleEndDateChange = (e) => {
        setCend_time(e.target.value);
    };

    return (
        <>
            <Heading />
            <div class="flex justify-center">
                <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-4xl" data-v0-t="card">
                    <form onSubmit={handleSubmit}>
                        <div class="flex flex-col space-y-1.5 p-6">
                            <h1 class="whitespace-nowrap font-semibold tracking-tight text-4xl">컨텐츠 등록</h1>
                        </div>
                        <div class="p-6 grid gap-8">
                            <div class="grid grid-cols-2 gap-6">
                                <div class="grid gap-4">
                                    <label
                                        class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                                        for="location"
                                    >
                                        주소
                                    </label>

                                    <select
                                        className='border rounded px-2 py-1'
                                        value={location}
                                        onChange={(e) => { setLocation(e.currentTarget.value) }}
                                    >
                                        <option value="1">전체</option>
                                        <option value="2">서울특별시</option>
                                        <option value="3">부산광역시</option>
                                        <option value="4">대구광역시</option>
                                        <option value="5">인천광역시</option>
                                        <option value="6">광주광역시</option>
                                        <option value="7">대전광역시</option>
                                        <option value="8">울산광역시</option>
                                        <option value="9">세종특별자치시</option>
                                        <option value="10">경기도</option>
                                        <option value="11">강원도</option>
                                        <option value="12">충청북도</option>
                                        <option value="13">충청남도</option>
                                        <option value="14">전라북도</option>
                                        <option value="15">전라남도</option>
                                        <option value="16">경상북도</option>
                                        <option value="17">경상남도</option>
                                        <option value="18">제주도</option>
                                    </select>
                                </div>
                                <div class="grid gap-4">
                                    <label
                                        class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                                        for="sub-location"
                                    >
                                        상세 주소
                                    </label>
                                    <select
                                        className='border rounded px-2 py-1'
                                        value={location2}
                                        onChange={(e) => { setLocation2(e.currentTarget.value) }}
                                    >
                                        <option value="">전체</option>
                                        {location2Data[location]?.map((loc) => (
                                            <option key={loc.value} value={loc.value}>{loc.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div class="grid grid-cols-2 gap-6">
                                <div class="grid gap-4">
                                    <label
                                        class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                                        for="start-date"
                                    >
                                        컨텐츠 시작일
                                    </label>
                                    <input
                                        min={today
                                            ? moment(cstart_time.dateTo).format('YYYY-MM-DD')
                                            : "yyyy-MM-dd"
                                        }
                                        type="date"
                                        id="startDate"
                                        name="startDate"
                                        onChange={handleStartDateChange}
                                        value={cstart_time}
                                        required
                                    />
                                </div>
                                <div class="grid gap-4">
                                    <label
                                        class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                                        for="end-date"
                                    >
                                        컨텐츠 종료일
                                    </label>
                                    <input
                                        min={cstart_time ? moment(cstart_time).format('YYYY-MM-DD') : today}

                                        type="date"
                                        id="endDate"
                                        name="endDate"
                                        onChange={handleEndDateChange}
                                        value={cend_time}
                                        required
                                    />
                                </div>
                            </div>
                            {/* 상시기간 설정을 위한 코드 */}
                            {/* <div class="grid gap-4">
                            <div class="flex items-center">
                                <input
                                    id="custom-checkbox"
                                    type="checkbox"
                                    class="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label for="custom-checkbox" class="ml-2 text-gray-700">
                                    선택하세요
                                </label>
                            </div>
                        </div> */}
                            <div class="grid gap-4">
                                <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="title">
                                    Contents Name
                                </label>
                                <input
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                                    id="title"
                                    value={cname}
                                    onChange={(e) => setCname(e.target.value)}
                                    placeholder="Enter a title for your post"
                                />
                            </div>
                            <div class="grid gap-4">
                                <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="cost">
                                    Cost
                                </label>
                                <input
                                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                                    id="title"
                                    value={cost}
                                    onChange={(e) => setCost(e.target.value)}
                                    placeholder="Enter a title for your post"
                                />
                            </div>
                            <div class="grid gap-4">
                                <label
                                    class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                                    for="ctype"
                                >
                                    Type
                                </label>
                                <select
                                    className='border rounded px-2 py-1'
                                    value={ctype}
                                    onChange={(e) => { setCtype(e.currentTarget.value) }}
                                >
                                    <option value="축제">축제</option>
                                    <option value="맛집">맛집</option>
                                    <option value="카페">카페</option>
                                    <option value="기타">기타</option>

                                </select>
                            </div>


                            <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="title">
                                Img
                            </label>
                            <input type="file" onChange={(e) => { fileupload(e) }} />


                            <div className='field'>
                                {/* <label>프로필사진 미리보기</label> */}
                                <div><img src={contentsimg} style={imgStyle} /></div>
                            </div>

                            <div class="flex justify-end gap-4">
                                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                    onClick={returnList}
                                >
                                    작성 취소
                                </button>
                                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                    type="submit"
                                >
                                    작성 완료
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContentsWrite;