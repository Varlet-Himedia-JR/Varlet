import React, { useState, useEffect, useRef } from 'react';
import jaxios from '../../util/jwtUtil';
import Footer from './../headerfooter/Footer';
import '../../style/course.css';
import CourseContents from '../contents/CourseContents';
import Timetablemaker from './Timetablemaker';
import Timetable from './Timetable';
import { getCookie } from "../../util/cookieUtil";
import { useLocation, useNavigate } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import Payment from './Payment';
import SelectedCustomCourse from './SelectedCustomCourse';

function Mycourse() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mycourse, setMycourse] = useState([]);
    const [courseDuration, setCourseDuration] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const userCookie = getCookie('user');
    const [ttmaker, setTtmaker] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const [contents, setContents] = useState({});
    const [selectedContents, setSelectedContents] = useState({});
    const [cellWidth, setCellWidth] = useState(0);
    const [isCourseContentsVisible, setIsCourseContentsVisible] = useState(false);
    const [isCourseCustom, setIsCourseCustom] = useState(false);
    const timetableRef = useRef();

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    // 일정 등록을 위한 변수
    const [sdate, setSdate] = useState('');
    const [stime, setStime] = useState('');
    const [etime, setEtime] = useState('');
    const [price, setPrice] = useState('');
    const [title, setTitle] = useState('');
    const [pcount, setPcount] = useState('1');

    useEffect(() => {
        if (location.state) {
            setSelectedContents(location.state);
        }
    }, []);

    const onChangeSelectedCustomCourse = () => {
        setSelectedContents({});
        if (location.state) {
            // location.state 값을 제거하기 위해 같은 경로로 state 없이 이동
            navigate(location.pathname, { replace: true });
        }
    };

    // 일정 등록 함수
    const addDayschedule = async () => {
        const sDateTimeString = `${sdate}T${stime}:00`;
        const sDateObject = new Date(sDateTimeString);
        const eDateTimeString = `${sdate}T${etime}:00`;
        const eDateObject = new Date(eDateTimeString);
        const dDateString = `${sdate}T00:00:00`;
        const dDateObject = new Date(dDateString);

        if (eDateObject <= sDateObject) {
            alert('종료시간은 시작시간보다 빠를 수 없습니다.');
            return; // 이 조건이 성립하면 함수 실행을 중단합니다.
        }

        try {
            let result = await jaxios.post('/api/dayschedule/insertDayschedule', {
                dtitle: title,
                cseq: 0,
                userid: getCookie('user').userid,
                tseq: selectedCourse,
                day_date: dDateObject,
                start_time: sDateObject,
                end_time: eDateObject,
                price: price,
                pcount: pcount
            });
            if (result.data.msg === 'ok') {
                alert('등록완료');
                setContents({});
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        jaxios.get(`/api/timetable/getAllMyCourse/${userCookie.userid}`)
            .then((result) => {
                const course = result.data.mycourse;
                const tnames = course.map(c => c.tname);
                setMycourse(result.data.mycourse);
                if (result.data.mycourse.length > 0) {
                    setSelectedCourse(course[0].tseq);
                    setCellWidth(tnames.length);
                }
            })
            .catch((err) => { console.error(err); });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            jaxios.get(`/api/course/getMycourse/${selectedCourse}/${userCookie.userid}`)
                .then((result) => {
                    setCourseDuration(result.data.duration);
                    if (result.data.dayschedule.length > 0) {
                        setDaySchedule(result.data.dayschedule);
                    } else {
                        setDaySchedule([]);
                    }
                    setCellWidth(`${90 / (result.data.duration.length)}`);
                })
                .catch((err) => { console.error(err); });
        }
    }, [selectedCourse]);

    const selectComponent = {
        ttmaker: <Timetablemaker />,
    };

    const handleClickButton = e => {
        const { name } = e.target;
        if (ttmaker === '') {
            setTtmaker(name);
        } else {
            setTtmaker('');
        }
    };

    const getHeight = () => {
        if (isCourseCustom || isCourseContentsVisible) {
            return '50%';
        }
        return '100%';
    };

    const onChangeCourseContents = () => {
        setIsCourseContentsVisible(!isCourseContentsVisible);
    };

    const closeCourseContents = () => {
        setIsCourseContentsVisible(false);
    };

    const onChangeCourseCustom = () => {
        setIsCourseCustom(!isCourseCustom);
    };

    const deleteMycourse = () => {
        const tseq = selectedCourse;
        if (window.confirm(`선택한 일정(${selectedCourse})을 삭제하시겠습니까?`)) {
            jaxios.post(`/api/timetable/deleteTimetable/${tseq}`)
                .then(() => {
                    window.location.reload();
                })
                .catch((err) => { console.error(err); });
        }
    };

    return (
        <div style={{ width: '100%' }}>
            <Heading />
            <div style={{ width: '100%' }}>
                <div className='mycourse_container' style={{ position: 'relative', top: '100px' }} onClick={closeCourseContents}>
                    <div className="coursemenu" style={{
                        paddingRight: '15px',
                        borderRight: '1px solid #d6d6d6'
                    }}>

                        <div className='course' style={{ width: '100%' }}>
                            <div className="space-y-2">
                                나의 여행
                            </div>
                            <br />
                            {mycourse.length > 0 ? (
                                <div className="flex justify-between">
                                    <select
                                        id="mycourse"
                                        name="mycourse"
                                        value={selectedCourse}
                                        onChange={handleCourseChange}
                                    >
                                        {mycourse.map((course, index) => (
                                            <option key={index} value={course.tseq}>
                                                {course.tname}
                                            </option>
                                        ))}
                                    </select>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={deleteMycourse}>
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                        <path d="M12 10l4 4m0 -4l-4 4" />
                                    </svg>
                                </div>
                            ) : <></>}
                        </div>
                        <br />
                        <div className='course' style={{ width: '100%' }}>
                            {getCookie('user') ? (
                                ttmaker === '' ? (
                                    <button className='addttamker' onClick={handleClickButton} name='ttmaker'>
                                        + 여행코스 만들기
                                    </button>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={handleClickButton}>
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                        <path d="M9 12h12l-3 -3" />
                                        <path d="M18 15l3 -3" />
                                    </svg>
                                )
                            ) : (<></>)}
                            {ttmaker === '' ? <></> : ttmaker && <Timetablemaker>{selectComponent[ttmaker]}</Timetablemaker>}
                        </div>
                        <br />
                        <div className='course' style={{ width: '100%' }}>
                            {selectedCourse ? <Payment daySchedule={daySchedule} /> : <></>}
                        </div>
                    </div>
                    {selectedCourse && cellWidth !== 0
                        ? <Timetable courseDuration={courseDuration} daySchedule={daySchedule} cellWidth={cellWidth} />
                        : <div className='tempTable'>
                            <br />
                            등록된 일정표가 없습니다. 일정을 등록하세요
                        </div>}


                </div>

            </div>
            {(!(isCourseContentsVisible || isCourseCustom)) && selectedCourse ? (
                <ul className='floating'>
                    <li className="button search" onClick={onChangeCourseContents}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-search"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#ffffff"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginTop: '10px' }}
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                            <path d="M21 21l-6 -6" />
                        </svg>
                        콘텐츠 목록에서 검색
                    </li>
                    <li className="button custom" onClick={onChangeCourseCustom}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="icon icon-tabler icon-tabler-search"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="#ffffff"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ marginTop: '10px' }}
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M12.54 20.996c-.176 .004 -.356 .004 -.54 .004c-7.2 0 -9 -1.8 -9 -9s1.8 -9 9 -9s9 1.8 9 9c0 .185 -.001 .366 -.004 .544" />
                            <path d="M16 19h6" />
                            <path d="M19 16v6" />
                        </svg>
                        직접 추가
                    </li>
                </ul>
            ) : <></>}
            {isCourseContentsVisible && (
                <div className="course_contents">
                    <div className="cchead" style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '60px', zIndex: 5 }}>
                        컨텐츠에서 선택 추가
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={onChangeCourseContents}>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                            <path d="M12 10l4 4m0 -4l-4 4" />
                        </svg>

                    </div>
                    <div style={{ zIndex: '5' }}>
                        <CourseContents mycourse={mycourse} selectedCourse={selectedCourse} contents={contents} />
                    </div>
                </div>
            )}
            {mycourse.length > 0 && Object.keys(selectedContents).length > 0 && (
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
                            width: '80%',
                            maxWidth: '600px',
                        }}
                    >
                        <div
                            className="cchead"
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingRight: '20px',
                            }}
                        >
                            <h2>선택한 컨텐츠를 추가</h2>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="icon icon-tabler icon-tabler-backspace"
                                width="40"
                                height="40"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="#000000"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                onClick={onChangeSelectedCustomCourse}
                                style={{ cursor: 'pointer' }}
                            >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                <path d="M12 10l4 4m0 -4l-4 4" />
                            </svg>
                        </div>
                        <div style={{ width: '100%' }}>
                            <SelectedCustomCourse selectedContents={selectedContents} mycourse={mycourse} />
                        </div>
                    </div>
                </div>
            )}

            {isCourseCustom && (
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
                            width: '80%',
                            maxWidth: '600px',
                        }}
                    >
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-x-2 flex justify-between items-center">
                                    <label
                                        className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="date"
                                    >
                                        직접 추가
                                    </label>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={onChangeCourseCustom}>
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                        <path d="M12 10l4 4m0 -4l-4 4" />
                                    </svg>
                                </div>
                                <hr />
                                <div className="flex space-x-4">
                                    <div className="space-y-2">
                                        <label
                                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="date"
                                        >
                                            나의 여행
                                        </label>
                                        {mycourse.length > 0 ? (
                                            <div className="flex justify-between">
                                                <select
                                                    id="mycourse"
                                                    name="mycourse"
                                                    value={selectedCourse}
                                                    onChange={handleCourseChange}
                                                >
                                                    {mycourse.map((course, index) => (
                                                        <option key={index} value={course.tseq}>
                                                            {course.tname}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        ) : <></>}
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            className="font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            htmlFor="date"
                                        >
                                            날짜
                                        </label>
                                        <div>
                                            <select
                                                id="sdate"
                                                name="sdate"
                                                value={sdate}
                                                onChange={(e) => setSdate(e.currentTarget.value)}
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
                                            className="block mb-2 font-medium text-gray-900 dark:text-white"
                                        >
                                            일정 시작 시간
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
                                                onChange={(e) => setStime(e.currentTarget.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label
                                            htmlFor="time"
                                            className="block mb-2 font-medium text-gray-900 dark:text-white"
                                        >
                                            일정 종료 시간
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
                                                onChange={(e) => setEtime(e.currentTarget.value)}
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
                                        placeholder="Enter a title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
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
                                        인원 수
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        id="people"
                                        placeholder="Enter the number of people"
                                        type="number"
                                        value={pcount}
                                        onChange={(e) => setPcount(e.currentTarget.value)}
                                    />
                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={addDayschedule}>일정등록</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Mycourse;
