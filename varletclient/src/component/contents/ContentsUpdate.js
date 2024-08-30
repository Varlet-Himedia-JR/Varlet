import React, { useState, useEffect } from 'react'
import axios from '../../util/jwtUtil'
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';
import moment from 'moment';
import { location1Data, location2Data } from '../request/LocaionData';



<script src="../path/to/flowbite/dist/flowbite.min.js"></script>

function ContentsUpdate() {
    const { cseq } = useParams();
    const [cname, setCname] = useState('');
    const [ctype, setCtype] = useState('축제');
    const [lnum, setLnum] = useState('1');
    const [lnum2, setLnum2] = useState('');
    const [location, setLocation] = useState('');
    const [location2, setLocation2] = useState('');
    const [cstart_time, setCstart_time] = useState('');
    const [cend_time, setCend_time] = useState('');
    const [cost, setCost] = useState('');
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    const userCookie = getCookie('user');
    const [contentsimg, setContentsimg] = useState('');
    const [imgStyle, setImgStyle] = useState({ display: "none" });
    const [contents, setContents] = useState({});

    async function fileupload(e) {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        const result = await jaxios.post('/api/member/fileupload', formData);
        setContentsimg(`http://localhost:8070/uploads/${result.data.filename}`);
        console.log(result.data.filename);


        setImgStyle({ display: "block", width: "200px" });
    }

    useEffect(
        () => {
            axios.get(`/api/contents/getContentsView/${cseq}`)
                .then((result) => {
                    setContents(result.data.contents);
                })
                .catch((err) => { console.error(err) })
        }, []
    )

    useEffect(() => {
        setCname(contents.cname);

        const locationIndex = getLocationIndex(contents.location);
        setLnum(locationIndex);
        setLocation(contents.location);

        const location2Index = getLocation2Index(lnum, contents.location2);
        setLnum2(location2Index);
        setLocation2(contents.location2);
        // cstart_time을 YYYY-MM-DD 형식으로 변환하여 상태 설정
        if (contents.cstart_time) {
            
            const formatDate = (timestamp) => {
                const date = new Date(timestamp);
                const dateString = date.toISOString(); // ISO 8601 형식의 문자열로 변환
                return dateString.substring(0, 10); // YYYY-MM-DD 부분 추출
            };

            const formattedDate = formatDate(contents.cstart_time);
            setCstart_time(formattedDate);
        }

        if (contents.cend_time) {
            
            const formatDate = (timestamp) => {
                const date = new Date(timestamp);
                const dateString = date.toISOString(); // ISO 8601 형식의 문자열로 변환
                return dateString.substring(0, 10); // YYYY-MM-DD 부분 추출
            };

            const formattedDate = formatDate(contents.cend_time);
            setCend_time(formattedDate);
        }
        setCost(contents.cost);
    }, [contents]);


    const getLocationIndex = (location) => {
        const locations = [
            "전체", "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시",
            "대전광역시", "울산광역시", "세종특별자치시", "경기도", "강원도", "충청북도",
            "충청남도", "전라북도", "전라남도", "경상북도", "경상남도", "제주도"
        ];
        return locations.indexOf(location) + 1; // +1은 option의 value 값과 일치시키기 위해 사용
    };

    const getLocation2Index = (lnum, location2) => {
        const locations2 = location2Data[lnum];

        if (locations2 && contents.location2) {
            const cityIndex = locations2.findIndex((item) => location2.includes(item.label));
            return cityIndex + 1; // 인덱스를 반환
        }

        return 0; // 일치하는 항목을 찾지 못했을 경우 0 반환
    };




    async function handleSubmit() {
        try {
            console.log({
                cseq:cseq,
                ctype: ctype,
                cname: cname,
                location: location,
                location2: location2,
                cstart_time: cstart_time,
                cend_time: cend_time,
                cost: cost,
                contentsimg: contentsimg
            });
            let result = await jaxios.post('/api/contents/updateContents', { cseq,ctype, cname, location, location2, cstart_time, cend_time, cost, contentsimg });
            if (result.data.msg == 'ok') {
                alert('수정');
                navigate('/contentsList');
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (location2Data[lnum]) {
            setLnum2(location2Data[lnum][0] || '');
        } else {
            setLnum2('');
        }
    }, [lnum]);

    // const onInputChange = (event) => {
    //     const { name, value } = event.target;
    //     if (name === 'startDate') {
    //         setCstart_time(value);
    //     } else if (name === 'endDate') {
    //         setCend_time(value);
    //     }
    // };

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
            <div class="flex justify-center" style={{ marginTop: '80px' }}>

                <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-4xl" data-v0-t="card">
                    <div class="flex flex-col space-y-1.5 p-6">
                        <h1 class="whitespace-nowrap font-semibold tracking-tight text-4xl">컨텐츠 수정</h1>
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
                                    value={lnum}
                                    onChange={(e) => {
                                        setLnum(e.currentTarget.value);
                                        setLocation(e.currentTarget.options[e.currentTarget.selectedIndex].text);
                                    }}
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
                                    value={lnum2}
                                    onChange={(e) => {
                                        setLnum2(e.currentTarget.value);
                                        setLocation2(e.currentTarget.options[e.currentTarget.selectedIndex].text);
                                    }}
                                >
                                    <option value="">전체</option>
                                    {location2Data[lnum]?.map((loc) => (
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
                                    min={today ? cstart_time : "yyyy-MM-dd"}
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
                                    min={today ? cstart_time : "yyyy-MM-dd"}
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    onChange={handleEndDateChange}
                                    value={cend_time}
                                    required
                                />
                            </div>
                        </div>
                        <div class="grid gap-4">
                            <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="title">
                                이름
                            </label>
                            <input
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                                id="title"
                                value={cname}
                                onChange={(e) => setCname(e.target.value)}
                                placeholder="이름을 입력하세요"
                            />
                        </div>
                        <div class="grid gap-4">
                            <label class="font-medium text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="cost">
                                비용
                            </label>
                            <input
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-base"
                                id="title"
                                value={cost}
                                onChange={(e) => setCost(e.target.value)}
                                placeholder="비용을 입력하세요"
                            />
                        </div>
                        <div class="grid gap-4">
                            <label
                                class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg"
                                for="ctype"
                            >
                                종류
                            </label>
                            <select
                                className='border rounded px-2 py-1'
                                value={ctype}
                                onChange={(e) => { setCtype(e.currentTarget.value) }}
                            >
                                <option value="축제">축제</option>
                                <option value="맛집">맛집</option>
                                <option value="카페">카페</option>
                                <option value="명소">명소</option>
                                <option value="기타">기타</option>

                            </select>
                        </div>


                        <label class="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-lg" for="title">
                            이미지
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
                                onClick={handleSubmit}
                            >
                                수정 완료
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ContentsUpdate;