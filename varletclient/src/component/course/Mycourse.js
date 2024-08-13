import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';
import Timetable from './Timetable';
import Timetable2 from './Timetable2';
import Timetablemaker from '../contents/Timetablemaker';

import '../../style/course.css';
import CourseContents from '../contents/CourseContents';


function Mycourse() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mycourse, setMycourse] = useState([]);
    const [courseDuration, setCourseDuration] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const userCookie = getCookie('user');
    const [ttmaker, setTtmaker] = useState();

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
                // jaxios.get(`/api/course/getDuration/${selectedCourse}   `)
                .then((result) => {
                    setCourseDuration(result.data.duration);
                    setDaySchedule(result.data.dayschedule);
                })
                .catch((err) => { console.error(err); });
        }
    }, [selectedCourse]);

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
    const [isCourseContentsVisible, setIsCourseContentsVisible] = useState(false);
    const [isCourseCustom, setIsCourseCustom] = useState(false);
    const getHeight = () => {
        if (isCourseCustom || isCourseContentsVisible) {
            return '50%';
        }
        return '100%'; // 기본 height 값을 100%로 설정
    };
    const onChangeCourseContents = () => {
        if (isCourseContentsVisible) {
            setIsCourseContentsVisible(false);
        } else {
            setIsCourseContentsVisible(true);
        }
    };

    const onChangeCourseCustom = () => {
        if (isCourseCustom) {
            setIsCourseCustom(false);
        } else {
            setIsCourseCustom(true);
        }
    };

    return (
        <>
            <Heading />
            <div className="mycourse_container" style={{
                height: getHeight(),
                transition: 'height 0.3s ease', // height 변경 시 애니메이션 효과 추가 (선택사항)
            }}>
                <div className='subPage' style={{ paddingTop: '100px' }}>
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

                <div className='subPage' style={{ paddingTop: '100px' }}>
                    {getCookie('user') ? (
                        <button onClick={handleClickButton} name='ttmaker' >
                            여행코스 만들기
                        </button>
                    ) : (<></>)}
                    {ttmaker == '' ? <></> : ttmaker && <Timetablemaker>{selectComponent[ttmaker]}</Timetablemaker>}
                </div>

                <div>
                    {daySchedule.map((ds) => (
                        <div>{ds.dseq}/{ds.dtitle}/{ds.userid}/{ds.day_date}/{ds.startTime}/{ds.endTime}/{ds.price}/{ds.pcount}</div>
                    ))}
                </div>
                <div className='timetable'>
                    {/* <Timetable courseDuration={courseDuration} /> */}
                    <Timetable2 courseDuration={courseDuration} daySchedule={daySchedule} />
                </div>
                <ul className='floating'>
                    <li class="button search" onClick={onChangeCourseContents}>콘텐츠 목록에서 검색</li>
                    <li class="button custom" onClick={onChangeCourseCustom}>직접 추가</li>
                </ul>
                
            </div>
            
            <div>
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
            </div>
            <Footer />
        </>
    );
}

export default Mycourse;
