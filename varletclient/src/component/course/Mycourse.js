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

function Mycourse() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mycourse, setMycourse] = useState([]);
    const [courseDuration, setCourseDuration] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const userCookie = getCookie('user');
    const [ttmaker, setTtmaker] = useState();
    const location = useLocation();
    const { cseq } = location.state || {};
    const [cellWidth, setCellWidth] = useState(0);
    const [isCourseContentsVisible, setIsCourseContentsVisible] = useState(false);
    const [isCourseCustom, setIsCourseCustom] = useState(false);

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
                setMycourse(tnames);
                // setMycourse(result.data.mycourse.tname);
                if (result.data.mycourse.length > 0) {
                    console.log(result.data.mycourse);
                    setSelectedCourse(tnames[0]);
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
                    setDaySchedule(result.data.dayschedule);
                    console.log('day');
                    console.log(daySchedule);
                    console.log(courseDuration);
                    setCellWidth(`${90 / (result.data.duration.length)}`)
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

    const onChangeCourseCustom = () => {
        setIsCourseCustom(!isCourseCustom);
    };

    return (

        <div style={{ width: '100%' }}>
            <Heading />
            <div style={{ width: '100%' }}>
                <div className='mycourse_container' style={{ position: 'relative', top: '100px', paddingBottom : '100px' }}>
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
                    </div>
                    <Timetable courseDuration={courseDuration} daySchedule={daySchedule}cellWidth={cellWidth} />

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
                    <CourseContents courseDuration={courseDuration} selectedCourse={selectedCourse} cseq={cseq}  />
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
