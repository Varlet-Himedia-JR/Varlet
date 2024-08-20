import React, { useState, useEffect } from 'react';
// import '../../style/Timetable.css';
// import '../../style/timetable2.css';
import { useNavigate } from "react-router-dom";

const Timetable = ({ courseDuration, daySchedule,cseq,cellWidth }) => {
    const [days, setDays] = useState([]);
    const times = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
    const [dayschedule, setDayschedule] = useState([]);
    const [schedule, setSchedule] = useState({});
    const [cellwidth, setCellwidth] = useState('');
    const navigate = useNavigate();
    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            console.log(courseDuration.length);
            setDays(courseDuration);
            console.log(days.length);
            console.log(cellwidth);
        }
        console.log(cellWidth);
        if (cellWidth > 0) {
            setCellwidth(cellWidth);
        }
    }, [courseDuration]);

    useEffect(() => {
        console.log(cellWidth);
        if (cellWidth > 0) {
            setCellwidth(cellWidth);
        }
    }, [cellwidth]);


    useEffect(() => {
        if (daySchedule && daySchedule.length > 0) {
            // console.log(daySchedule);
            setDayschedule(daySchedule);
        }
    }, [daySchedule]);
    function pay(){
        navigate('/pay', { state: { dayschedule } });
    }

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
            {dayschedule.map((contents, index) => (
                <div key={index} className="coursecell" style={{ width: cellwidth }}>{contents.dtitle}/{contents.price}</div>
            ))}
            <main className="flex-1 p-4">
                <div className="grid grid-cols-6 gap-4">
                    {days.map(day => (
                        <div key={day} className="col-span-1 text-center">{day}</div>
                    ))}
                </div>
                <div className="grid grid-cols-6 gap-4 mt-4">
                    <div className="col-span-1 h-24 border">오전 9시</div>
                    <div className="col-span-1 h-24 border">오전 10시</div>
                    <div className="col-span-1 h-24 border">오전 11시</div>
                    <div className="col-span-1 h-24 border">오후 12시</div>
                    <div className="col-span-1 h-24 border">오후 1시</div>
                    <div className="col-span-1 h-24 border">오후 2시</div>
                    <div className="col-span-1 h-24 border">오후 3시</div>
                    <div className="col-span-1 h-24 border">오후 4시</div>
                    <div className="col-span-1 h-24 border">오후 5시</div>
                    <div className="col-span-1 h-24 border">오후 6시</div>
                    <div className="col-span-1 h-24 border">오후 7시</div>
                    <div className="col-span-1 h-24 border">오후 8시</div>
                    <div className="col-span-1 h-24 border">오후 9시</div>
                </div>
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-red-500">
                        수업 목록에서 검색
                    </button>
                </div>
            </main>
            <button onClick={pay} style={{border:'1px solid black'}}>이거 누르면    결제</button>
        </div>

    );
};

export default Timetable;