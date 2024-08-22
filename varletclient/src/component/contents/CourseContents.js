import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import { getCookie } from '../../util/cookieUtil';
import '../../style/paging.css';
import '../../style/review.css';
import jaxios from '../../util/jwtUtil';

function CourseContents({ courseDuration, selectedCourse, cseq }) {

    const [contentsList, setContentsList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true);
    const [selectedContents, setSelectedContents] = useState({});
    const [days, setDays] = useState([]);
    const [sdate, setSdate] = useState('');
    // const [edate, setEdate] = useState('');
    const [stime, setStime] = useState('');
    const [etime, setEtime] = useState('');
    const [dayschedule, setDayschedule] = useState({});
    const [tseq, setTseq] = useState(selectedCourse);
    const [price, setPrice] = useState('');
    const [pcount, setPcount] = useState('1');
    const navigate = useNavigate();
    const [isAddContentsVisible, setIsAddContentsVisible] = useState(false);
    const [selectedCseq, setSelectedCseq] = useState('');

    const onInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'sdate') {
            setSdate(value);
        } else if (name === 'edate') {
            // setEdate(value);
        }
    };

    // const handleStart_timeChange = (event) => {
    //     setStart_time(event.target.value);
    // };
    // const handleEnd_timeChange = (event) => {
    //     setEnd_time(event.target.value);
    // };

    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
            setSdate(courseDuration[0]);
            // setStart_time(days[0]);
            // setEnd_time(days[days.length-1]);
        }
    }, [courseDuration]);

    // 즐길거리에서 넘어왔을때 함수
    useEffect(
        () => {
            // setSelectedCseq(cseq);
            if (selectedCseq > 0) {
                axios.get(`/api/contents/getContentsView/${cseq}`)
                    .then((result) => {
                        setSelectedContents(result.data.contents);
                        console.log(result.data.contents);
                        setIsAddContentsVisible(!isAddContentsVisible);
                    })
                    .catch((err) => { console.error(err) })
            }
        }, []
    )




    // 데이터 로드 함수
    const loadContents = useCallback(async (pageNumber) => {
        try {
            const result = await axios.get(`/api/contents/contentsList/${pageNumber}`);
            const { contentsList: newContents, paging } = result.data;

            if (Array.isArray(newContents) && newContents.length > 0) {
                setContentsList(preContents => [...preContents, ...newContents]);
                setPage(pageNumber);

                // 다음 페이지가 없으면 hasMore를 false로 설정
                if (!paging || (paging && paging.next === null)) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    // 스크롤 이벤트 핸들러
    const handleScroll = useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // 스크롤이 페이지 하단에 도달했을 때
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
            loadContents(page + 1);
        }
    }, [page, hasMore, loadContents]);

    // 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // 초기 데이터 로드
    useEffect(() => {
        loadContents(page);
    }, [loadContents, page]);

    // function onContentsView(rseq) {
    //     navigate(`/reviewView/${rseq}`);
    // }

    //addcontents 창 호출 함수
    const onChangeAddContents = (contents) => {
        setSelectedContents(contents);
        if (isAddContentsVisible) {
            setIsAddContentsVisible(false);
        } else {
            setIsAddContentsVisible(true);
        }
    };


    // useEffect(() => {

    //     axios.get(`/api/timetable/getTseq/${selectedCourse}`)
    //         .then((result) => {
    //             console.log(selectedContents)
    //             console.log(selectedCourse);
    //             console.log(result.data.tseq);
    //             console.log(result.tseq);
    //             setTseq(result.data.tseq);

    //         })
    //         .catch((err) => { console.error(err); });
    // }, []);

    // 일정 등록 함수
    const addDayschedule = async () => {

        const sDateTimeString = `${sdate}T${stime}:00`;
        const sDateObject = new Date(sDateTimeString);
        const eDateTimeString = `${sdate}T${etime}:00`;
        const eDateObject = new Date(eDateTimeString);
        const dDateString = `${sdate}T00:00:00`;
        const dDateObject = new Date(dDateString);
        // setTemp(new Date(`${sdate}T${etime}:00`));
        // setDayschedule({
        //     dtitle: selectedContents.dname,
        //     cseq: selectedContents.cseq,
        //     userid: getCookie('user').userid,
        //     tseq: tseq,
        //     day_date: sDateObject,
        //     start_time: sDateObject,
        //     end_time: eDateObject,
        //     price: price,
        //     pcount: pcount
        // }
        // )
        try {
            // console.log("stringggg : ", sDateTimeString)
            // console.log("berfore insert : ", { dtitle: selectedContents.cname, cseq: selectedContents.cseq, userid: getCookie('user').userid, tseq: tseq, day_date: sDateObject, start_time: sDateObject, end_time: eDateObject, price: price, pcount: pcount });
            let result = await jaxios.post('/api/dayschedule/insertDayschedule', {
                dtitle: selectedContents.cname,
                cseq: selectedContents.cseq,
                userid: getCookie('user').userid,
                tseq: tseq,
                day_date: dDateObject,
                start_time: sDateObject,
                end_time: eDateObject,
                price: price,
                pcount: pcount
            });
            if (result.data.msg == 'ok') {
                alert('등록완료');
                setIsAddContentsVisible(false);
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }


    }


    return (
        <div className='mycourseContentsList' style={{ width: '100%' }}>
            <div className="contentstable" style={{ width: '100%', paddingTop: '40px', margin: '0' }}>
                <div className='row'>
                    <div className="col">번호</div>
                    <div className="col">이름</div>
                    <div className="col">종류</div>
                    <div className="col">지역</div>
                    <div className="col">시작기간</div>
                    <div className="col">종료기간</div>
                    <div className="col"></div>
                </div>
                {
                    Array.isArray(contentsList) && contentsList.length > 0 ? (
                        contentsList.map((contents, idx) => (
                            <div className="row" key={idx} onClick={() => onChangeAddContents(contents)}>
                                <div className="col">{contents.cseq}</div>
                                <div className="col" style={{ textAlign: "left" }} >{contents.cname}</div>
                                <div className="col">{contents.ctype}</div>
                                <div className="col">{contents.location} {contents.location2}</div>
                                <div className="col">{contents.cstartTime ? contents.cstartTime.toString().substring(0, 10) : ''}</div>
                                <div className="col">{contents.cendTime ? contents.cendTime.toString().substring(0, 10) : ''}</div>
                                <div className="col"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-calendar-plus" width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" />
                                    <path d="M16 3v4" />
                                    <path d="M8 3v4" />
                                    <path d="M4 11h16" />
                                    <path d="M16 19h6" />
                                    <path d="M19 16v6" />
                                </svg></div>
                            </div>
                        ))
                    ) : (
                        <div>리뷰가 없습니다.</div>
                    )
                }
            </div>
            {/* 로딩 중 표시 */}
            {hasMore && <div className="loading">Loading more reviews...</div>}
            {isAddContentsVisible && (
                <div className="add_contents" >
                    {/* -------------------- */}

                    {/* -------------------- */}
                    <div className="max-w-2xl mx-auto p-6 sm:p-8 md:p-10 z-1000">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <span className="mx-auto">일정 등록</span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="icon icon-tabler icon-tabler-logout"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    strokeWidth="1.5"
                                    stroke="#000000"
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    onClick={onChangeAddContents}
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                    <path d="M9 12h12l-3 -3" />
                                    <path d="M18 15l3 -3" />
                                </svg>
                            </div>


                            <div className="rounded-lg border bg-card text-card-foreground">
                                <div className="p-6 space-y-6">
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="flex space-x-4">
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    htmlFor="date"
                                                >
                                                    Date
                                                </label>
                                                <div>
                                                    <select
                                                        id="sdate"
                                                        name="sdate"
                                                        value={sdate}
                                                        onChange={(e) => { setSdate(e.currentTarget.value) }}
                                                    >
                                                        {days.map((day, index) => (
                                                            <option key={index} value={day}>
                                                                {day}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="time"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    Start time
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                        <svg
                                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="time"
                                                        id="stime"
                                                        name="stime"
                                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        required
                                                        onChange={(e) => { setStime(e.currentTarget.value) }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label
                                                    htmlFor="time"
                                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                >
                                                    End time
                                                </label>
                                                <div className="relative">
                                                    <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                                        <svg
                                                            className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                            aria-hidden="true"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                    <input
                                                        type="time"
                                                        id="etime"
                                                        name="etime"
                                                        className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                        required
                                                        onChange={(e) => { setEtime(e.currentTarget.value) }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div className="space-y-2">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                htmlFor="time-end"
                                            >
                                                End Time
                                            </label>
                                            <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" type="time" id="etime" name="etime" required onChange={(e) => { setEtime(e.currentTarget.value) }} />

                                        </div> */}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                htmlFor="title"
                                            >
                                                Title
                                            </label>
                                            <input
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                id="title"
                                                placeholder="Enter a title"
                                                value={selectedContents.cname}
                                            // onChange={(e) => setTitle(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                htmlFor="price"
                                            >
                                                Price
                                            </label>
                                            <input
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                id="price"
                                                placeholder="Enter a price"
                                                type="number"
                                                value={price}
                                                onChange={(e) => setPrice(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-4">
                                        <div className="space-y-2">
                                            <label
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                htmlFor="people"
                                            >
                                                Number of People
                                            </label>
                                            <input
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                id="people"
                                                placeholder="Enter the number of people"
                                                type="number"
                                                value={pcount}
                                                onChange={(e) => { setPcount(e.currentTarget.value) }}

                                            />
                                            <button onClick={addDayschedule}>일정등록</button>
                                            {/* <input type="text" value={1} onChange={(e) => { setPcount(e.currentTarget.value) }} /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default CourseContents
