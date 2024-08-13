import React, { useState, useEffect, useRef } from 'react';
import jaxios from '../../util/jwtUtil';
import Footer from './../headerfooter/Footer';
import '../../style/course.css';
import CourseContents from '../contents/CourseContents';
import Timetablemaker from './Timetablemaker';
import { getCookie } from "../../util/cookieUtil";
import Timetable from './Timetable';
import Timetable2 from './Timetable2';

import Heading from '../headerfooter/Heading';

function Mycourse() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mycourse, setMycourse] = useState([]);
    const [courseDuration, setCourseDuration] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const userCookie = getCookie('user');
    const [ttmaker, setTtmaker] = useState();

    const [cellWidth, setCellWidth] = useState(0);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    useEffect(() => {
        jaxios.get(`/api/course/getTnames/${userCookie.userid}`)
            .then((result) => {
                setMycourse(result.data.mycourse);
                if (result.data.mycourse.length > 0) {
                    setSelectedCourse(result.data.mycourse[0]);
                }
            })
            .catch((err) => { console.error(err); });
    }, [userCookie.userid]);

    useEffect(() => {
        if (selectedCourse) {
            jaxios.get(`/api/course/getMycourse/${selectedCourse}/${userCookie.userid}`)
                .then((result) => {
                    setCourseDuration(result.data.duration);
                    setDaySchedule(result.data.dayschedule);
                })
                .catch((err) => { console.error(err); });
        }
    }, [selectedCourse]);

    useEffect(() => {
        const cellElement = document.querySelector('.cell');
        if (cellElement) {
            const width = cellElement.getBoundingClientRect().width;
            setCellWidth(width);
        }
    }, []);

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

    const [isCourseContentsVisible, setIsCourseContentsVisible] = useState(false);
    const [isCourseCustom, setIsCourseCustom] = useState(false);
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

    return (
        <div style={{ width: '100%' }}>
            <Heading/>
            <div className='mycourse_container' style={{position:'relative', top:'100px'}}>
                <div className="coursemenu" style={{
                }}>

                    <div className='course' style={{ width: '100%' }}>
                        <label htmlFor="mycourse">여행 코스를 고르세요</label>
                        <select
                            id="mycourse"
                            name="mycourse"
                            value={selectedCourse}
                            onChange={handleCourseChange}
                        >
                            {mycourse.map((course, index) => (
                                <option key={index} value={course}>
                                    {course}
                                </option>
                            ))}
                        </select>
                        <p>Selected Course: {selectedCourse}</p>
                    </div>

                    <div className='course' style={{ width: '100%' }}>
                        {getCookie('user') ? (
                            <button onClick={handleClickButton} name='ttmaker' >
                                여행코스 만들기
                            </button>
                        ) : (<></>)}
                        {ttmaker === '' ? <></> : ttmaker && <Timetablemaker>{selectComponent[ttmaker]}</Timetablemaker>}
                    </div>
                    {/* <div className="schedule">
                        {daySchedule.map((ds, index) => (
                            <div
                                key={index}
                                className="dayschedule"
                                style={{
                                    width: `${cellWidth}px`,
                                    border: '1px solid black',
                                    margin: '5px',
                                    padding: '10px',
                                    boxSizing: 'border-box'
                                }}
                            >
                                {ds.dseq}/{ds.dtitle}/{ds.userid}/{ds.day_date}/{ds.start_time}/{ds.end_time}/{ds.price}/{ds.pcount}
                            </div>
                        ))}
                    </div> */}
                </div>
                <div className='timetable' >
                    {/* <Timetable courseDuration={courseDuration} daySchedule={daySchedule} /> */}
                    <Timetable2 courseDuration={courseDuration} daySchedule={daySchedule} />
                </div>
            </div>
            <ul className='floating'>
                <li className="button search" onClick={onChangeCourseContents}>콘텐츠 목록에서 검색</li>
                <li className="button custom" onClick={onChangeCourseCustom}>직접 추가</li>
            </ul>


            {isCourseContentsVisible && (
                <div className="course_contents" >
                    <div className="cchead" style={{ display: 'flex', justifyContent: 'center' }}>
                        <h2>course_contents</h2>
                        <button style={{ border: '1px solid black' }} onClick={onChangeCourseContents}>
                            X
                        </button>
                    </div>
                    <div style={{ height: '40px', position: 'fixed', top: '50%' }}></div>
                    <CourseContents courseDuration={courseDuration} selectedCourse={selectedCourse} />
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
