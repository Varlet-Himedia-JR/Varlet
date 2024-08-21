import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import jaxios from '../../util/jwtUtil';

const Timetable = ({ courseDuration, daySchedule, cellWidth }) => {
    const [days, setDays] = useState([]);
    const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const colors = ['red', 'blue', 'green', 'blueviolet', 'purple', 'orange', 'pink', 'teal', 'brown', 'gray'];
    const [dayschedule, setDayschedule] = useState([]);
    const [scheduledetail, setScheduledetail] = useState({});
    const [schedule, setSchedule] = useState({});
    const [cellwidth, setCellwidth] = useState(cellWidth);
    const [cellposition, setCellposition] = useState([]);
    const [isScheduledetailVisible, setIsScheduledetailVisible] = useState(false);
    const navigate = useNavigate();
    const courseCellRef = useRef(null); // reference for the coursecell
    const [sdate, setSdate] = useState('');
    const [stime, setStime] = useState('');
    const [etime, setEtime] = useState('');
    const [price, setPrice] = useState('');
    const [pcount, setPcount] = useState('1');


    const updateCellWidth = () => {
        if (courseCellRef.current) {
            const courseCellPixelWidth = getCourseCellWidthInPixels();
            setCellwidth(courseCellPixelWidth);
        }
    };

    const scheduleDetail = (dseq, index) => {
        setIsScheduledetailVisible(false);
        setScheduledetail(dayschedule[index]);
    }

    const closeScheduleDetail = () => {
        setIsScheduledetailVisible(false);
    };

    // 일정 등록 함수
    const updateDayschedule = async () => {

        const sDateTimeString = `${sdate}T${stime}:00`;
        const sDateObject = new Date(sDateTimeString);
        const eDateTimeString = `${sdate}T${etime}:00`;
        const eDateObject = new Date(eDateTimeString);
        const dDateString = `${sdate}T00:00:00`;
        const dDateObject = new Date(dDateString);

        try {
            let result = await jaxios.post('/api/dayschedule/updateDayschedule', {
                dtitle: scheduleDetail.dtitle,
                cseq: scheduleDetail.cseq,
                userid: scheduleDetail.userid,
                tseq: scheduleDetail.tseq,
                day_date: dDateObject,
                start_time: sDateObject,
                end_time: eDateObject,
                price: price,
                pcount: pcount
            });
            if (result.data.msg == 'ok') {
                alert('등록완료');
                setIsScheduledetailVisible(false);
            }
        } catch (err) {
            console.error(err);
        }
    }

    const updatePositions = () => {
        if (daySchedule && daySchedule.length > 0) {
            const position = [];
            for (let i = 0; i < daySchedule.length; i++) {
                let x = 0;
                let y = 0;
                let l = 0;
                let c = 'black';

                for (let j = days.length - 1; j >= 0; j--) {
                    if (days[j].substring(5, 10) === daySchedule[i].day_date.substring(5, 10)) {
                        x = days.length - 1 - j;
                        break;
                    }
                }

                for (let j = 0; j < times.length; j++) {
                    if (times[j].substring(0, 2) === daySchedule[i].start_time.substring(11, 13)) {
                        y = j + 1 + daySchedule[i].start_time.substring(14, 16) / 60;
                        break;
                    }
                }

                let startTime = new Date(daySchedule[i].start_time);
                let endTime = new Date(daySchedule[i].end_time);
                let differenceInMillis = endTime - startTime;
                l = differenceInMillis / (1000 * 60 * 60);
                const randomIndex = Math.floor(Math.random() * 10);
                const selectedColor = colors[randomIndex];
                position.push({ x: x, y: y, l: l, c: selectedColor });
            }
            setCellposition(position);
        }
    };

    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
        }
        if (cellWidth > 0) {
            setCellwidth(cellWidth);
        }
    }, [courseDuration, cellWidth]);

    useEffect(() => {
        if (daySchedule && daySchedule.length > 0) {
            setDayschedule(daySchedule);
            updatePositions();
        }
    }, [daySchedule, days, cellwidth]);

    useEffect(() => {
        updateCellWidth(); // Initial calculation
        window.addEventListener('resize', updateCellWidth);
        return () => window.removeEventListener('resize', updateCellWidth);
    }, [days]);

    useEffect(() => {
        updatePositions();
    }, [cellwidth]);

    const getCourseCellWidthInPixels = () => {
        if (courseCellRef.current) {
            return courseCellRef.current.offsetWidth;
        }
        return 0;
    };

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
            {daySchedule.length > 0 ?
                dayschedule.map((contents, index) => (
                    <div key={index} className="datacell" style={{ right: `${cellposition[index].x * cellwidth}px`, top: `${cellposition[index].y * 40}px`, height: `${cellposition[index].l * 40}px`, backgroundColor: `${cellposition[index].c}`, color: 'white', width: `${getCourseCellWidthInPixels()}px` }} onClick={()=>scheduleDetail(contents.dseq, index, isScheduledetailVisible)} >
                        {contents.dtitle}/{contents.start_time}
                    </div>
                ))
                : <></>
            }
            <button onClick={pay} style={{ border: '1px solid black' }}>결제</button>
        </div>
    );
};

export default Timetable;
