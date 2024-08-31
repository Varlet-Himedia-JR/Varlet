import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { getCookie } from '../../util/cookieUtil';
import '../../style/paging.css';
import '../../style/review.css';
import jaxios from '../../util/jwtUtil';

function CourseContents({ selectedCourse, cseq, mycourse }) {

    const [contentsList, setContentsList] = useState([]);
    // const [scourse, setScourse] = useState('');
    const [courseDuration, setCourseDuration] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // 검색어
    const [selectedContents, setSelectedContents] = useState({});
    const [filteredContents, setFilteredContents] = useState([]);// 필터된 리뷰 목록
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
    // 상세보기로 이동
    function getContentsView(cseq) {
        navigate(`/getContentsView/${cseq}`);
    }


    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
            setSdate(courseDuration[0]);
            // setStart_time(days[0]);
            // setEnd_time(days[days.length-1]);
        }
    }, [courseDuration]);


    useEffect(() => {
        if (tseq) {
            jaxios.get(`/api/course/getMycourse/${tseq}/${getCookie('user').userid}`)
                .then((result) => {
                    setCourseDuration(result.data.duration);
                })
                .catch((err) => { console.error(err); });
        }
    }, [tseq]);

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
                setContentsList(prevContents => {
                    // 기존에 있는 내용과 새로운 내용을 합쳐서 중복을 제거함
                    const combinedContents = [...prevContents, ...newContents];
                    const uniqueContents = Array.from(new Set(combinedContents.map(content => content.cseq)))
                        .map(cseq => combinedContents.find(content => content.cseq === cseq)); // cseq로 구별하여 중복컨텐츠 제거
                    return uniqueContents;
                });

                setPage(pageNumber);

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

    // 필터링 함수
    const filterContents = useCallback(async () => {
        if (searchTerm.trim() === '') {
            setFilteredContents(contentsList);
        } else {
            const result = await axios.get('/api/contents/search', { params: { query: searchTerm } })
            console.log(result);
            console.log(result.data.contentsList);
            const newContents = result.data.contentsList; // 서버 응답의 데이터 구조에 맞게 필드 수정
            setFilteredContents(newContents); // 서버에서 받은 필터링된 결과를 상태에 저장
        }
    }, [searchTerm, contentsList]);

    // 스크롤 이벤트 핸들러
    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop; // 현재위치
        const scrollHeight = document.documentElement.scrollHeight; // 스크롤 가능한 크기
        const clientHeight = document.documentElement.clientHeight; // 내용물의 크기

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

    // 검색어 변경 핸들러
    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    // 검색어가 변경될 때마다 필터링
    useEffect(() => {
        filterContents();
    }, [searchTerm, filterContents]);

    //addcontents 창 호출 함수
    const onChangeAddContents = (contents) => {
        setSelectedContents(contents);
        if (isAddContentsVisible) {
            setIsAddContentsVisible(false);
        } else {
            setIsAddContentsVisible(true);
        }
    };


    // 검색창 초기화 
    function handleClearSearch() {
        setSearchTerm('');
    }

    // 일정 등록 함수
    const addDayschedule = async () => {

        const sDateTimeString = `${sdate}T${stime}:00`;
        const sDateObject = new Date(sDateTimeString);
        const eDateTimeString = `${sdate}T${etime}:00`;
        const eDateObject = new Date(eDateTimeString);
        const dDateString = `${sdate}T00:00:00`;
        const dDateObject = new Date(dDateString);
        try {
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
    const handleCourseChange = (event) => {
        setTseq(event.target.value);
    };



    return (
        <div className='mycourseContentsList' style={{ width: '100%' }}>
            <div className="contentstable" style={{ width: '100%', paddingTop: '40px', margin: '0' }}>
                <div className="search-container" style={{ marginBottom: "20px", width: "100%" }}>
                    <input
                        className='search-bar'
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="축제명으로 검색"
                    />
                    {searchTerm && (
                        <button className="clear-button" onClick={handleClearSearch}>X</button>
                    )}
                </div>
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
                    Array.isArray(filteredContents) && filteredContents.length > 0 ? (
                        filteredContents.map((contents, idx) => (
                            <div className="row" key={idx} onClick={() => getContentsView(contents.cseq)}>
                                <div className="col">{contents.cseq}</div>
                                <div className="col" style={{ textAlign: "left" }} >{contents.cname}</div>
                                <div className="col">{contents.ctype}</div>
                                <div className="col">{contents.location} {contents.location2}</div>
                                <div className="col">{contents.cstart_time ? contents.cstart_time.toString().substring(0, 10) : ''}</div>
                                <div className="col">{contents.cend_time ? contents.cend_time.toString().substring(0, 10) : ''}</div>
                                <div
                                    onClick={(event) => {
                                        event.stopPropagation(); // 이벤트 전파 중지
                                        onChangeAddContents(contents); // 함수 실행
                                    }}
                                    className="col"><svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-calendar-plus" width="32" height="32" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round">
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
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="modal-content add_contents"
                        style={{
                            backgroundColor: '#fff',
                            padding: '20px',
                            borderRadius: '8px',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '80%',
                            overflowY: 'auto',
                        }}
                    >
                        <div className="max-w-2xl mx-auto p-6 sm:p-8 md:p-10 z-1000">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="mx-auto">일정 등록</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={onChangeAddContents}>
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                        <path d="M12 10l4 4m0 -4l-4 4" />
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
                                                        나의 여행
                                                    </label>
                                                    {mycourse.length > 0 ? (
                                                        <div className="flex justify-between">
                                                            <select
                                                                id="mycourse"
                                                                name="mycourse"
                                                                value={tseq}
                                                                onChange={handleCourseChange}
                                                            >
                                                                {mycourse.map((course, index) => (
                                                                    <option key={index} value={course.tseq}>
                                                                        {course.tname}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label
                                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        htmlFor="date"
                                                    >
                                                        날짜
                                                    </label>
                                                    <div>
                                                        <select
                                                            id="sdate"
                                                            name="sdate"
                                                            value={sdate}
                                                            onChange={(e) => {
                                                                setSdate(e.currentTarget.value);
                                                            }}
                                                        >
                                                            {courseDuration.map((day, index) => (
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
                                                        시작 시간
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
                                                            onChange={(e) => {
                                                                setStime(e.currentTarget.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label
                                                        htmlFor="time"
                                                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                                    >
                                                        종료 시간
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
                                                            onChange={(e) => {
                                                                setEtime(e.currentTarget.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    htmlFor="title"
                                                >
                                                    제목
                                                </label>
                                                <input
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    id="title"
                                                    placeholder="제목을 입력하세요"
                                                    value={selectedContents.cname}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <label
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                    htmlFor="price"
                                                >
                                                    가격
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
                                                    인원수
                                                </label>
                                                <input
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    id="people"
                                                    placeholder="Enter the number of people"
                                                    type="number"
                                                    value={pcount}
                                                    onChange={(e) => {
                                                        setPcount(e.currentTarget.value);
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                                    onClick={addDayschedule}
                                                >
                                                    일정등록
                                                </button>
                                            </div>
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
