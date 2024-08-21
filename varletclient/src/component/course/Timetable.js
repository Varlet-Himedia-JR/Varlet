import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import jaxios from '../../util/jwtUtil';

const Timetable = ({ courseDuration, daySchedule, cellWidth }) => {
    const [days, setDays] = useState([]);
    const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const colors = ['#f2e8e8', '#ffe9e9', '#dcf2e9', '#dee8f6', '#eff9cc', '#fff8cc', '#ffedda', '#dceef2'];
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

    const deleteDayschedule = async (dseq) => {
        const isDelete = window.confirm(`${dseq}를 삭제하시겠습니까?`);
        if (isDelete) {
            try {
                const result = await jaxios.post(`/api/dayschedule/deleteDayschedule/${dseq}`);
                if (result.data.msg == 'ok') {
                    window.location.reload();
                }
            } catch (err) {
                console.error(err);
            }
        }
    }

    // 일정 등록 함수
    // const updateDayschedule = async () => {

    //     const sDateTimeString = `${sdate}T${stime}:00`;
    //     const sDateObject = new Date(sDateTimeString);
    //     const eDateTimeString = `${sdate}T${etime}:00`;
    //     const eDateObject = new Date(eDateTimeString);
    //     const dDateString = `${sdate}T00:00:00`;
    //     const dDateObject = new Date(dDateString);

    //     try {
    //         let result = await jaxios.post('/api/dayschedule/updateDayschedule', {
    //             dtitle: scheduleDetail.dtitle,
    //             cseq: scheduleDetail.cseq,
    //             userid: scheduleDetail.userid,
    //             tseq: scheduleDetail.tseq,
    //             day_date: dDateObject,
    //             start_time: sDateObject,
    //             end_time: eDateObject,
    //             price: price,
    //             pcount: pcount
    //         });
    //         if (result.data.msg == 'ok') {
    //             alert('등록완료');
    //             setIsScheduledetailVisible(false);
    //         }
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }

    const updatePositions = () => {
        if (daySchedule && daySchedule.length > 0) {
            const position = [];
            for (let i = 0; i < daySchedule.length; i++) {
                console.log(i, '번째 레츠기릿');
                console.log(daySchedule[i].day_date);

                // Date 객체로 변환
                let date = new Date(daySchedule[i].day_date);

                // 9시간을 더함 (9 * 60 * 60 * 1000 밀리초)
                date.setTime(date.getTime() + (9 * 60 * 60 * 1000));

                // 다시 문자열로 변환
                let daydate = date.toISOString();
                // console.log('조정된 날짜:', daydate);

                date = new Date(daySchedule[i].start_time);
                date.setTime(date.getTime() + (9 * 60 * 60 * 1000));
                
                let stime = date.toISOString();

                let x = 0;
                let y = 0;
                let l = 0;
                let c = 'black';

                for (let j = days.length - 1; j >= 0; j--) {
                    console.log('day 비교:', days[j].substring(5, 10));
                    console.log('스케쥴 비교:', daydate.substring(5, 10));

                    if (days[j].substring(5, 10) === daydate.substring(5, 10)) {
                        x = days.length - 1 - j;
                        break;
                    } else {
                        console.log('일치 안함');
                    }
                }

                for (let j = 0; j < times.length; j++) {
                    if (times[j].substring(0, 2) === stime.substring(11, 13)) {
                        y = j + 1 + stime.substring(14, 16) / 60;
                        break;
                    }
                }

                let startTime = new Date(daySchedule[i].start_time);
                let endTime = new Date(daySchedule[i].end_time);
                let differenceInMillis = endTime - startTime;
                l = differenceInMillis / (1000 * 60 * 60);
                const randomIndex = Math.floor(Math.random() * 8);
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
        updatePositions();
    }, [courseDuration, cellWidth]);

    useEffect(() => {
        if (daySchedule && daySchedule.length > 0) {
            setDayschedule(daySchedule);
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
                <div className="coursecell" style={{backgroundColor:`#f2f2f2`, width: `${cellwidth / 2}%` }}></div>
                {days.map((day, index) => (
                    <div key={day} className="coursecell" ref={index === 0 ? courseCellRef : null} style={{backgroundColor:`#f2f2f2`, width: `${cellwidth}%` }}>
                        {day}
                    </div>
                ))}
            </div>
            {times.map(time => (
                <div key={time} className="courserow">
                    <div className="coursecell" style={{backgroundColor:`#f8f8f8`, width: `${cellwidth / 2}%` }}>{time}</div>
                    {days.map((_, index) => (
                        <div key={index} className="coursecell" style={{backgroundColor:`#f8f8f8`, width: `${cellwidth}%` }}></div>
                    ))}
                </div>
            ))}
            {daySchedule.length > 0 ?
                dayschedule.map((contents, index) => (
                    <div key={index} className="datacell" style={{ right: `${cellposition[index].x * cellwidth}px`, top: `${cellposition[index].y * 40}px`, height: `${cellposition[index].l * 40}px`, backgroundColor: `${cellposition[index].c}`, color: 'black', width: `${getCourseCellWidthInPixels()}px` }} onClick={() => scheduleDetail(contents.dseq, index, isScheduledetailVisible)} >
                        {contents.dtitle}/{contents.price>0?'₩'+contents.price:'무료'}
                        {/* {contents.start_time}/{contents.day_date} */}
                        <button style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: 'transparent', border: 'none', color: 'black', fontSize: '16px', cursor: 'pointer', padding: 0 }}
                            onClick={(e) => {
                                e.stopPropagation(); // 부모 div의 onClick 이벤트를 막음
                                deleteDayschedule(contents.dseq, index); // X 버튼 클릭 시 동작
                            }}>
                            ×
                        </button>
                    </div>
                ))
                : <></>
            }
            <button onClick={pay} style={{ border: '1px solid black' }}>결제</button>
        </div>
    );
};

export default Timetable;
