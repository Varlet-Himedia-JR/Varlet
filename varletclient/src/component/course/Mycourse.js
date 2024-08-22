import React, { useState, useEffect, useRef } from 'react';
import jaxios from '../../util/jwtUtil';
import Footer from './../headerfooter/Footer';
import '../../style/course.css';
import CourseContents from '../contents/CourseContents';
import Timetablemaker from './Timetablemaker';
import Timetable from './Timetable';
import { getCookie } from "../../util/cookieUtil";
import { useLocation } from 'react-router-dom';
import Heading from '../headerfooter/Heading';
import html2canvas from 'html2canvas';
import Payment from './Payment';
function Mycourse() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mycourse, setMycourse] = useState([]);
    const [mycoursename, setMycoursename] = useState([]);
    const [courseDuration, setCourseDuration] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const userCookie = getCookie('user');
    const [ttmaker, setTtmaker] = useState('');
    const location = useLocation();
    const { cseq } = location.state || {};
    const [cellWidth, setCellWidth] = useState(0);
    const [isCourseContentsVisible, setIsCourseContentsVisible] = useState(false);
    const [isCourseCustom, setIsCourseCustom] = useState(false);
    const timetableRef = useRef();
    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    useEffect(() => {
        if (cseq) {
            setIsCourseContentsVisible(true);
        }
    }, [cseq]);

    useEffect(() => {
        // jaxios.get(`/api/course/getTnames/${userCookie.userid}`)
        jaxios.get(`/api/timetable/getAllMyCourse/${userCookie.userid}`)
            .then((result) => {
                const course = result.data.mycourse;
                const tnames = course.map(c => c.tname);
                setMycoursename(tnames);
                setMycourse(result.data.mycourse)
                // setMycourse(result.data.mycourse.tname);
                if (result.data.mycourse.length > 0) {
                    // console.log(result.data.mycourse);
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
                    // console.log(daySchedule);
                    // console.log(courseDuration);
                    setCellWidth(`${90 / (result.data.duration.length)}`)
                })
                .catch((err) => { console.error(err); });
        }
    }, [selectedCourse]);

    // const captureTimetable = () => {
    //     const timetableElement = timetableRef.current;
    //     html2canvas(timetableElement).then(canvas => {
    //         const imgData = canvas.toDataURL('image/png');
    //         const link = document.createElement('a');
    //         link.href = imgData;
    //         link.download = 'timetable.png';
    //         link.click();
    //     }).catch(error => {
    //         console.error('캡쳐 중 오류 발생:', error);
    //     });
    // };



    const selectComponent = {
        ttmaker: <Timetablemaker />,
    };

    const handleClickButton = e => {
        const { name } = e.target;
        if (ttmaker == '') {
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

    const onChangeCourseCustom = () => {
        setIsCourseCustom(!isCourseCustom);
    };
    const deleteMycourse = () => {
        if (window.confirm(`선택한 일정(${selectedCourse})을 삭제하시겠습니까?`)) {
            const tseq = selectedCourse
            const result = jaxios.post('/api/timetable/deleteTimetable', { tseq })
                .then(() => {
                    if (result.data.msg == 'ok') {
                        alert('삭제했나,,?');
                        window.location.reload();
                    }
                })
                .catch((err) => { console.error(err) })
        }
    }

    return (

        <div style={{ width: '100%' }}>
            <Heading />
            <div style={{ width: '100%' }}>
                <div className='mycourse_container' style={{ position: 'relative', top: '100px', paddingBottom: '100px' }}>
                    <div className="coursemenu" style={{
                        paddingRight: '15px',
                        borderRight: '1px solid #d6d6d6'
                    }}>
                        {/* <div className='background'><img src="http://localhost:8070/images/oceans.jpg" alt="Background" /></div> */}

                        <div className='course' style={{ width: '100%' }}>
                            <div className="space-y-2">
                                나의 여행
                            </div>
                            <br></br>
                            {mycourse.length > 0 ? <div className="flex justify-between">
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={() => { deleteMycourse() }}>
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                    <path d="M12 10l4 4m0 -4l-4 4" />
                                </svg>
                            </div> : <></>}

                            {/*
                            <label htmlFor="mycourse">여행 코스를 고르세요</label>
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
                            */}
                            {/* <p>Selected Course: {selectedCourse}</p> */}
                        </div>
                        <br></br>
                        <div className='course' style={{ width: '100%' }}>
                            {getCookie('user') ? (
                                (ttmaker == '' ? <button className='coursemenubtn' onClick={handleClickButton} name='ttmaker' >
                                    여행코스 만들기
                                </button>
                                    :
                                    // <svg style={{right:'0'}} xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-backspace" width="40" height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round" onClick={handleClickButton}>
                                    //     <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    //     <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                    //     <path d="M12 10l4 4m0 -4l-4 4" />
                                    // </svg>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-logout" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={handleClickButton}>
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                        <path d="M9 12h12l-3 -3" />
                                        <path d="M18 15l3 -3" />
                                    </svg>)
                            ) : (<></>)}
                            {ttmaker == '' ? <></> : ttmaker && <Timetablemaker>{selectComponent[ttmaker]}</Timetablemaker>}
                        </div>
                        <br></br>
                        <div className='course' style={{ width: '100%' }}>
                            {selectedCourse ?
                                <Payment daySchedule={daySchedule} />

                                : <></>}
                        </div>
                        {/* <div ref={timetableRef}></div> */}
                        {/* <button className='coursemenubtn' onClick={captureTimetable} style={{ marginTop: '20px', padding: '10px' }}>
                            시간표 캡쳐하기
                        </button> */}
                    </div>

                    {/* -------------시간표------------- */}

                    {/* {cellWidth==0?<Timetable courseDuration={courseDuration} daySchedule={daySchedule} cellWidth={cellWidth} />:<></>} */}
                    {selectedCourse ? <Timetable courseDuration={courseDuration} daySchedule={daySchedule} cellWidth={cellWidth} />
                        : <div className='tempTable'>
                            <br></br>
                            등록된 일정표가 없습니다. 일정을 등록하세요
                        </div>}

                </div>

            </div>
            {
                (!(isCourseContentsVisible || isCourseCustom)) && selectedCourse ?
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
                            콘텐츠 목록에서 검색</li>
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
                            </svg>직접 추가</li>
                    </ul>
                    : <></>
            }


            {isCourseContentsVisible && (
                <div className="course_contents" >
                    <div className="cchead" style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '60px' }}>
                        course_contents
                        {/* &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={onChangeCourseContents}>
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                            <path d="M12 10l4 4m0 -4l-4 4" />
                        </svg>
                        {/* <button style={{ border: '1px solid black' }} >
                            X
                        </button> */}
                    </div>
                    <div style={{ zIndex: '5' }}>
                        <CourseContents courseDuration={courseDuration} selectedCourse={selectedCourse} cseq={cseq} />
                    </div>
                </div>
            )}
            {isCourseCustom && (
                <div className="course_contents" >
                    <div className="cchead" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2>course_custom</h2>
                        <button style={{ border: '1px solid black' }} onClick={onChangeCourseCustom}>
                            X
                        </button>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default Mycourse;
