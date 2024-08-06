import React, { useState, useEffect } from 'react';
import './Timetable.css';

const Timetable = ({ courseDuration }) => {
    const [days, setDays] = useState([]);
    const times = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
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
    );
};

export default Timetable
