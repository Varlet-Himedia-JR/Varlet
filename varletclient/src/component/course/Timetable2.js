import React, { useState, useEffect } from 'react';
import './Timetable.css';
const Timetable = ({ courseDuration, daySchedule }) => {
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

    // day와 time에 해당하는 daySchedule 데이터를 가져오는 함수
    const getCellData = (day, time) => {
        return daySchedule.filter(
            (ds) => ds.day_date === day && ds.startTime === time
        );
    };

    return (
        <div>
            <div className="timetable" style={{ display: 'grid', gridTemplateColumns: `repeat(${days.length + 1}, 1fr)` }}>
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
                                <div>{schedule[day + time]}</div>
                                <div>
                                    {getCellData(day, time).map((ds) => (
                                        <div key={ds.dseq}>
                                            {ds.dseq}/{ds.dtitle}/{ds.userid}/{ds.day_date}/{ds.startTime}/{ds.endTime}/{ds.price}/{ds.pcount}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Timetable;
