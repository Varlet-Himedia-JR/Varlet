import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import { useNavigate } from "react-router-dom";
import jaxios from '../../util/jwtUtil';

function Timetablemaker() {
    // 상태로 선택된 날짜를 'yyyy-mm-dd' 형식의 문자열로 저장
    const [start_date, setStart_date] = useState(formatDate(new Date()));
    const [end_date, setEnd_date] = useState(formatDate(new Date()));
    const [tname, setTname] = useState('');
    const [description, setDescription] = useState('');

    // const onChange1 = newDate => {
    //     // 새로운 날짜를 포맷하고 상태에 저장
    //     // setStart_date(formatDate(newDate));
    //     const { name, value } = event.target;
    //     if (name === 'startDate') {
    //         setStartDate(value);
    //     } else if (name === 'endDate') {
    //         setEndDate(value);
    //     }
    // };

    const onInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'start_date') {
            setStart_date(value);
        } else if (name === 'end_date') {
            setEnd_date(value);
        }
    };

    // const onChange2 = newDate => {
    //     // 새로운 날짜를 포맷하고 상태에 저장
    //     setEnd_date(formatDate(newDate));
    // };
    const navigate = useNavigate();

    function onTimetable() {
        if (!getCookie('user')) {
            navigate('/login');
        } else {
            const userid = getCookie('user').userid;
            jaxios.post('/api/timetable/inserTimetable', { userid, tname, start_date, end_date, description })
                .then(() => {
                    alert('일정 생성 완료');
                    navigate('/')
                })
                .catch((err) => { console.error(err) })
        }
    }


    // Date 객체를 'yyyy-mm-dd' 형식의 문자열로 변환
    function formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = (`0${d.getMonth() + 1}`).slice(-2); // 월은 0부터 시작하므로 1을 더해줌
        const day = (`0${d.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    }
    return (
        <div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="title"
                >
                    Title
                </label>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="title"
                    placeholder="Enter title"
                />
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="content"
                >
                    Content
                </label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="content"
                    placeholder="Enter content"
                    rows="4"
                ></textarea>
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="date1"
                >
                    Select Date 1
                </label>
            </div>
            <div className="space-y-2">
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="date2"
                >
                    Select Date 2
                </label>
            </div>
        </div>
        // <div >
        //     <div >
        //         <div>
        //             <label>제목</label>
        //             <input style={{ border: '1px solid black' }} type='text' onChange={(e) => {
        //                 setTname(e.currentTarget.value);
        //             }}></input>
        //         </div>
        //         <div>
        //             <label>내용</label>
        //             <textarea
        //                 style={{ border: '1px solid black' }}
        //                 value={description}
        //                 onChange={e => setDescription(e.target.value)}
        //             />
        //         </div>
        //     </div>
        //     <div>
        //         {/* <Calendar
        //             onChange={onChange1}
        //             value={new Date(start_date)}  // 문자열을 다시 Date 객체로 변환하여 전달
        //         /> */}
        //         <input
        //             type="date"
        //             id="start_date"
        //             name="start_date"
        //             onChange={onInputChange}
        //             value={start_date}
        //             required
        //         />
        //     </div>
        //     <div>
        //         {/* <Calendar
        //             onChange={onChange2}
        //             value={new Date(end_date)}  // 문자열을 다시 Date 객체로 변환하여 전달
        //         /> */}
        //         <input
        //             type="date"
        //             id="end_date"
        //             name="end_date"
        //             onChange={onInputChange}
        //             value={end_date}
        //             required
        //         />
        //     </div>
        //     <button onClick={
        //         () => { onTimetable(); }
        //     }>일정 생성</button>
        // </div>
    )
}

export default Timetablemaker