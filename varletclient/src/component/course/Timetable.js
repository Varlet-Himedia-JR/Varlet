import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const Timetable = ({ courseDuration, daySchedule, cellWidth }) => {
    const [days, setDays] = useState([]);
    const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const [dayschedule, setDayschedule] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [cellwidth, setCellwidth] = useState(cellWidth);
    const [cellposition, setCellposition] = useState([]);
    const navigate = useNavigate();
    const courseCellRef = useRef(null); // reference for the coursecell

    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
            // console.log(days);
        }
        if (cellWidth > 0) {
            setCellwidth(cellWidth);
        }
    }, [courseDuration, cellWidth]);

    useEffect(() => {
        if (daySchedule && daySchedule.length > 0) {
            setDayschedule(daySchedule);
            const position = [];
            for (let i = 0; i < daySchedule.length; i++) {
                let x = 0;
                let y = 0;
                let l = 0;

                for (let j = days.length-1; j >= 0; j--) {
                    if (days[j].substring(5, 10) === daySchedule[i].day_date.substring(5, 10)) {
                        x = j;
                        break;  // 일치하는 날짜를 찾으면 루프를 종료합니다.
                    }
                }

                for (let j = 0; j < times.length; j++) {
                    if (times[j].substring(0, 2) === daySchedule[i].start_time.substring(11, 13)) {
                        y = j;
                        break;  // 일치하는 시간을 찾으면 루프를 종료합니다.
                    }
                }

                let startTime = new Date(daySchedule[i].start_time);
                let endTime = new Date(daySchedule[i].end_time);

                // 두 시간 사이의 차이(밀리초 단위)
                let differenceInMillis = endTime - startTime;

                // 밀리초를 시간으로 변환
                l = differenceInMillis / (1000 * 60 * 60);

                // x, y, l을 객체로 position 배열에 추가
                position.push({ x:x, y:y, l:l });
            }
            setCellposition(position);
            console.log(position);

        }
    }, [daySchedule]);

    const getCourseCellWidthInPixels = () => {
        if (courseCellRef.current) {
            return courseCellRef.current.offsetWidth;
        }
        return 0;
    };

    useEffect(() => {
        if (courseCellRef.current) {
            const courseCellPixelWidth = getCourseCellWidthInPixels();
            setCellwidth(courseCellPixelWidth); // Update state with pixel width
        }
    }, [days, cellwidth]);

    function pay() {
        navigate('/pay', { state: { dayschedule } });
    }

    return (
        <div className="timetable">
            <div className="courserow">
                <div className="coursecell" style={{ width: `${cellwidth / 2}%` }}></div>
                {days.map((day, index) => (
                    <div key={day} className="coursecell" ref={index === 0 ? courseCellRef : null} style={{ width: `${cellwidth}%` }}>
                        {day}
                    </div>
                ))}
            </div>
            {times.map(time => (
                <div key={time} className="courserow">
                    <div className="coursecell" style={{ width: `${cellwidth / 2}%` }}>{time}</div>
                    {days.map((_, index) => (
                        <div key={index} className="coursecell" style={{ width: `${cellwidth}%` }}></div>
                    ))}
                </div>
            ))}
            {dayschedule.map((contents, index) => (
                <div key={index} className="datacell" style={{ right:`${cellposition[index].x*cellwidth}px`, top: `${cellposition[index].y*40}px`, height:`${cellposition[index].l*40}px`, backgroundColor: 'red', color: 'white', width: `${getCourseCellWidthInPixels()}px` }}>
                    {contents.dtitle}
                </div>
            ))}
            <button onClick={pay} style={{ border: '1px solid black' }}>결제</button>
        </div>
    );
};

export default Timetable;
