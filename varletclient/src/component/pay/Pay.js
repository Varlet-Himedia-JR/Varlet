import React, { useState, useEffect } from 'react';
// import '../../style/Timetable.css';
import '../../style/timetable2.css';
import { useNavigate, useLocation  } from "react-router-dom";

function Pay() {
    const location = useLocation();
    const { dayschedule } = location.state || {};

    useEffect(() => {
    if (window.IMP) {
        window.IMP.init('imp17261207');
        console.log('아임포트 SDK 초기화 성공');
    } else {
        console.error("아임포트 SDK가 로드되지 않았습니다.");
    }
}, []);

function requestPay() {
    console.log('dayschedule:', dayschedule[0].price);

    if (!window.IMP) {
        console.error("IMP 객체가 정의되지 않았습니다.");
        return;
    }
    window.IMP.request_pay({
        pg: "html5_inicis",
        pay_method: "card",
        merchant_uid: 'merchant_' + new Date().getTime(),
        name: '결제테스트',
        amount:  dayschedule[0].price,  // 오류 방지를 위해 기본값 0 설정
        buyer_email: 'user@example.com',
        buyer_name: '홍길동',
        buyer_tel: '010-1234-5678',
        buyer_addr: '서울특별시 강남구 삼성동',
        buyer_postcode: '123-456'
    }, function (rsp) {
        if (rsp.success) {
            alert('결제가 성공적으로 완료되었습니다.');
            console.log('결제 성공:', rsp);
        } else {
            alert('결제에 실패하였습니다. 에러 내용: ' + rsp.error_msg);
            console.error('결제 실패:', rsp);
        }
    });
}


    return (
        <>
            <h2>결제내역들</h2>
            <div>제목/가격/유저아이디/day/시작시간/종료시간/가격/인원수</div>
            {dayschedule.map((contents, index) => (
                <div key={index}>
                    {index + 1}번째 결제내역 : {contents.dtitle}/{contents.price}/{contents.userid}/{contents.day_date.substring(0, 10)}/{contents.start_time.substring(0, 10)}/{contents.end_time.substring(0, 10)}/{contents.price}/{contents.pcount}
                </div>
            ))}
            <button onClick={requestPay}>결제하기</button>
        </>
    )
}

export default Pay;