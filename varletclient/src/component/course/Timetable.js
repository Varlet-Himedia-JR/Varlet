import React, { useState, useEffect } from 'react';
import './Timetable.css';
// import 삭제버튼 from "http://localhost:8070/images/deletebutton.png";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutAction } from '../../store/userSlice';
import axios from 'axios';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";

const Timetable = ({ courseDuration }) => {
    const [days, setDays] = useState([]);
    const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const [schedule, setSchedule] = useState({});

    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
        }
    }, [courseDuration]);

    const addClass = (day, time) => {
        const className = prompt("수업명을 입력하세요:");
        if (className) {
            setSchedule(prevSchedule => ({
                ...prevSchedule,
                [day + time]: className
            }));
        }
    };

    return (
        <div>
            <div className="timetable" style={{ gridTemplateColumns: `repeat(${days.length + 1}, 1fr)` }}>
                <div className="theader"></div>
                {days.map(day => (
                    <div key={day} className="theader">{day}</div>
                ))}
                {times.map(time => (
                    <React.Fragment key={time}>
                        <div className="time">{time}</div>
                        {days.map(day => (
                            <div
                                key={day + time}
                                className="cell"
                                onClick={() => addClass(day, time)}
                            >
                                {schedule[day + time]}
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
            <hr />

            <div>
                <tbody>
                    <tr>
                        <th></th>
                        {days.map(day => (
                            <td >
                                <div key={day} className="theader">{day}</div>
                            </td>
                        ))}
                    </tr>
                </tbody>
                <tbody>
                    <tr>
                        <td>
                            <div className='grids'>
                                {times.map(time => (
                                    <div key={time} className="cell">{time}</div>
                                ))}
                            </div>
                        </td>
                        {days.map(day => (
                            <td>
                                <div className='cols' style={{width:'20px', height:'20px'}}>
                                    <div className='subject color3'>
                                        {/* <ul className='status'>
                                        <img className='img' src="http://localhost:8070/images/deletebutton.png" style={{width:'20px', height:'20px'}} />
                                        </ul> */}
                                    </div>
                                </div>
                                <div className='grids'>
                                    {times.map(time => (
                                        <div className="cell" style={{ border: '1px solid black' }}></div>
                                    ))}
                                </div>
                            </td>
                        ))}
                    </tr>
                </tbody>

            </div>
        </div>
    );
};

export default Timetable
