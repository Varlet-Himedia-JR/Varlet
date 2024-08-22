import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";
import { useNavigate } from "react-router-dom";
import jaxios from '../../util/jwtUtil';
import moment from 'moment';
function Timetablemaker() {
    const [start_date, setStart_date] = useState('');
    const [end_date, setEnd_date] = useState('');
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

    const onInputChange = (e) => {
        // const { name, value } = event.target;
        // if (name === 'start_date') {
        //     setStart_date(value);
        // } else if (name === 'end_date') {
        setEnd_date(e.target.value);
        // }
    };

    // const onChange2 = newDate => {
    //     // 새로운 날짜를 포맷하고 상태에 저장
    //     setEnd_date(formatDate(newDate));
    // };
    const navigate = useNavigate();
    const today = new Date();
    function onTimetable() {
        if (!getCookie('user')) {
            navigate('/login');
        } else {
            if (tname == '') { return alert('제목을 입력하세요'); }
            if (start_date == '' || end_date == '') { return alert('기간을 입력하세요'); }
            // if(start_date==''){ return alert('제목을 입력하세요');}
            const userid = getCookie('user').userid;
            jaxios.post('/api/timetable/insertTimetable', { userid, tname, start_date, end_date, description })
                .then(() => {
                    alert('일정 생성 완료');
                    window.location.reload();
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

    const handleStartDateChange = (e) => {
        const selectedStartDate = e.target.value;
        setStart_date(selectedStartDate);

        // 만약 새로운 시작일이 종료일 이후라면 종료일 초기화
        if (end_date && moment(selectedStartDate).isAfter(moment(end_date))) {
            setEnd_date(''); // 시작일을 변경했으므로 종료일을 초기화
        }
    };

    return (
        <div>
            &nbsp;
            <div className="space-y-2">
                제목
                <br></br>
                <input
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="title"
                    placeholder="제목을 입력하세요"
                    onChange={(e) => { setTname(e.currentTarget.value); }}
                />
            </div>
            &nbsp;
            <div className="space-y-2">
                내용
                <br></br>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="content"
                    placeholder="내용을 입력하세요"
                    rows="4"
                ></textarea>
            </div>
            &nbsp;
            <div className="space-y-2">
                기간
                <br></br>
                <div>
                    {/* <Calendar
                    onChange={onChange1}
                    value={new Date(start_date)}  // 문자열을 다시 Date 객체로 변환하여 전달
                /> */}
                    {/* <input
                        type="date"
                        id="start_date"
                        name="start_date"
                        onChange={onInputChange}
                        value={start_date}
                        required
                    /> */}
                    <input
                        min={today
                            ? moment(start_date.dateTo).format('YYYY-MM-DD')
                            : "yyyy-MM-dd"
                        }
                        style={{ width: '40%' }}
                        type="date"
                        id="start_date"
                        name="start_date"
                        onChange={handleStartDateChange}
                        value={start_date}
                        required
                    />
                    &nbsp;~&nbsp;
                    {/* <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-tilde" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="#000000" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M4 12c0 -1.657 1.592 -3 3.556 -3c1.963 0 3.11 1.5 4.444 3c1.333 1.5 2.48 3 4.444 3s3.556 -1.343 3.556 -3" />
                    </svg> */}
                    <input
                        style={{ width: '40%' }}
                        type="date"
                        id="end_date"
                        name="end_date"
                        onChange={onInputChange}
                        value={end_date}
                        required
                    />
                </div>
            </div>
            &nbsp;
            <div
                className=" text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32"
                style={{ backgroundColor: '#1e90ff' }}
                onClick={() => { onTimetable(); }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                    <path d="M13.5 6.5l4 4" />
                </svg>
                <span className="text-xl font-bold">등록</span>
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
        // <div>
        //     {/* <Calendar
        //         onChange={onChange1}
        //         value={new Date(start_date)}  // 문자열을 다시 Date 객체로 변환하여 전달
        //     /> */}
        //     <input
        //         type="date"
        //         id="start_date"
        //         name="start_date"
        //         onChange={onInputChange}
        //         value={start_date}
        //         required
        //     />
        // </div>
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