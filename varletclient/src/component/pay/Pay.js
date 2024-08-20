import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation  } from "react-router-dom";

function Pay() {
    const location = useLocation();
    const { dayschedule } = location.state || {};
    
    return (
        <div>
            <h2>결제내역들</h2>
            <div>제목/가격/유저아이디/day/시작시간/종료시간/가격/인원수</div>
            {dayschedule.map((contents, index) => (
                <div key={index} >{index+1}번째 결제내역 : {contents.dtitle}/{contents.price}/{contents.userid}/{contents.day_date.substring(0, 10)}/{contents.start_time.substring(0, 10)}/{contents.end_time.substring(0, 10)}/{contents.price}/{contents.pcount}</div>
            ))}
        </div>
    )
}

export default Pay
