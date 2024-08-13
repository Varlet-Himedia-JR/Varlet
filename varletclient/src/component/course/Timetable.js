import React, { useState, useEffect } from 'react';
import '../../style/Timetable.css';
const Timetable = ({ courseDuration, daySchedule }) => {
    const [days, setDays] = useState([]);
    const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const [dayschedule, setDayschedule] = useState([]);
    const [schedule, setSchedule] = useState({});

    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
        }
    }, [courseDuration]);

    useEffect(() => {
        if (daySchedule && daySchedule.length > 0) {
            console.log(daySchedule);
            setDayschedule(daySchedule);
        }
    }, [daySchedule]);

    // const addClass = (day, time) => {
    //     const className = prompt("수업명을 입력하세요:");
    //     if (className) {
    //         setSchedule(prevSchedule => ({
    //             ...prevSchedule,
    //             [day + time]: className
    //         }));
    //     }
    // };


    return (
        <div style={{width:'100%'}}>
            <div style={{width:'100%'}}>
                <tbody>
                    <div className='timetabletr' >
                        <th></th>
                        {days.map(day => (
                            <td >
                                <div key={day} className="theader">{day}</div>
                            </td>
                        ))}
                    </div>
                </tbody>
                <tbody>
                    <tr >
                        <td>
                            <div className='grids'>
                                {times.map(time => (
                                    <div key={time} className="cell">{time}</div>
                                ))}
                            </div>
                        </td>
                        {days.map(day => (
                            <td key={day.dseq}>
                                <div className='cols' style={{ width: '20px', height: '20px' }}>
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
                        {/* <div className='dayschedule'>{dayschedule[0].dtitle}</div> */}
                    </tr>
                </tbody>

            </div>
        </div>
    );
};

export default Timetable;