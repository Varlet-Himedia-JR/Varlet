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

    const onChange1 = newDate => {
        // 새로운 날짜를 포맷하고 상태에 저장
        setStart_date(formatDate(newDate));
    };

    const onChange2 = newDate => {
        // 새로운 날짜를 포맷하고 상태에 저장
        setEnd_date(formatDate(newDate));
    };
    const navigate = useNavigate();

    function onTimetable(){
        if(!getCookie('user')){
            navigate('/login');
        }else{
            const userid = getCookie('user').userid;
            jaxios.post('/api/timetable/inserTimetable' , {userid, tname,start_date, end_date, description}  )
            .then(()=>{ 
                alert('일정 생성 완료');
                navigate('/')
            } )
            .catch((err)=>{console.error(err)})
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
            <div style={{ display: 'flex', justifyContent: 'column' }}>
                <div >
                    <div>
                        <label>제목</label>
                        <input style={{ border: '1px solid black' }} type='text' onChange={(e) => {
                            setTname(e.currentTarget.value);
                        }}></input>
                    </div>
                    <div>
                        <label>내용</label>
                        <textarea
                        style={{border:'1px solid black'}}
                            value={description} 
                            onChange={e => setDescription(e.target.value)} 
                        />
                    </div>
                </div>
                <div>
                    <Calendar
                        onChange={onChange1}
                        value={new Date(start_date)}  // 문자열을 다시 Date 객체로 변환하여 전달
                    />
                    <p>선택된 날짜: {start_date}</p>
                </div>
                <div>
                    <Calendar
                        onChange={onChange2}
                        value={new Date(end_date)}  // 문자열을 다시 Date 객체로 변환하여 전달
                    />
                    <p>선택된 날짜: {end_date}</p>
                </div>
                <button onClick={
                            ()=>{ onTimetable(); }
                        }>일정 생성</button>
            </div>
        </div>
    )
}

export default Timetablemaker