import React, { useState, useEffect } from 'react';
// import '../../style/Timetable.css';
import '../../style/timetable2.css';
const Timetable2 = ({ courseDuration, daySchedule }) => {
    const [days, setDays] = useState([]);
    const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const [dayschedule, setDayschedule] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [cellwidth, setCellWidth] = useState([]);

    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
            setCellWidth(`${90 / (days.length)}%`);
        }
    }, [courseDuration]);

    useEffect(() => {
        if (daySchedule && daySchedule.length > 0) {
            // console.log(daySchedule);
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
        <div className="timetable">

            <div className="courserow">
                <div className="coursecell" style={{ width: '10%' }}></div>
                {days.map(day => (
                    <div key={day} className="coursecell" style={{ width: cellwidth }}>
                        {day}
                    </div>
                ))}
            </div>
            {times.map(time => (
                <div key={time} className="courserow">
                    <div className="coursecell" style={{ width: '10%' }}>{time}</div>
                    {days.map((_, index) => (
                        <div key={index} className="coursecell" style={{ width: cellwidth }}></div>
                    ))}
                </div>
            ))}
            {/* <div className='dayschedule'>{dayschedule[0].dtitle}</div> */}

        </div>

    );
};

export default Timetable2;