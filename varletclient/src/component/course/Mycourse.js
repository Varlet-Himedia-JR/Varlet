import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';
import Timetable from './Timetable';
import Timetable2 from './Timetable2';
import Timetablemaker from '../contents/Timetablemaker';


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

    return (
        <article>
            <Heading />

            <div className='subPage'>
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

            <div className='subPage'>
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
            {/* <img src='https://www.mcst.go.kr/attachFiles/cultureInfoCourt/localFestival/notifyFestival/1719535357705.jpg'/> */}
            <Footer />
        </article>
    );
}

export default Mycourse;
