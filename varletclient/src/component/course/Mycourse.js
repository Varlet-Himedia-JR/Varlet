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

function Mycourse() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mycourse, setMycourse] = useState([]);
    const [courseDuration, setCourseDuration] = useState([]);
    const userCookie = getCookie('user');

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    useEffect(() => {
        axios.get(`/api/course/getTnames/${userCookie.userid}`)
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
            axios.get(`/api/course/getDuration/${selectedCourse}`)
                .then((result) => {
                    setCourseDuration(result.data.duration);
                })
                .catch((err) => { console.error(err); });
        }
    }, [selectedCourse]);

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
            <div className='timetable'>
                <Timetable courseDuration={courseDuration} />
            </div>
            <Footer />
        </article>
    );
}

export default Mycourse;
