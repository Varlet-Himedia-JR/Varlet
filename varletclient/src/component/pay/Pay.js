import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { getCookie } from "../../util/cookieUtil";


function Pay() {
    const location = useLocation();

    const { dayschedule } = location.state || {};
    const [daySchedule, setDaySchedule] = useState([]);
    const userCookie = getCookie('user');

    const navigate = useNavigate();
    useEffect(() => {
        if (window.IMP) {
            window.IMP.init('imp17261207');
            console.log('아임포트 SDK 초기화 성공');
        } else {
            console.error("아임포트 SDK가 로드되지 않았습니다.");
        }
    }, []);

    useEffect(() => {
        setDaySchedule(dayschedule);
    }, []);

    const merchantUid = 'merchant_' + new Date().getTime();

    function requestPay() {
        console.log('dayschedule:', dayschedule[0].price);

        if (!window.IMP) {
            console.error("IMP 객체가 정의되지 않았습니다.");
            return;
        }
        window.IMP.request_pay({
            pg: "html5_inicis",
            merchant_uid: merchantUid,
            pay_method: "card",
            merchant_uid: 'merchant_' + new Date().getTime(),
            name: '결제테스트',
            buyer_email: userCookie.email,
            buyer_name: userCookie.name,
            buyer_tel: userCookie.phone,
            buyer_addr: userCookie.address,
            buyer_postcode: userCookie.zip_code,
            amount: dayschedule[0].price,  // 오류 방지를 위해 기본값 0 설정
        }, function (rsp) {
            if (rsp.success) {
                alert(`결제가 성공적으로 완료되었습니다. 주문번호: ${rsp.merchant_uid}`);
                console.log('결제 성공:', rsp);
                navigate('/mycourse')
            } else {
                alert('결제에 실패하였습니다. 에러 내용: ' + rsp.error_msg);
                console.error('결제 실패:', rsp);
            }
        });
    }
    function savePaymentHistory(paymentData) {
        fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                merchant_uid: paymentData.merchant_uid,  // 주문번호
                buyer_email: userCookie.email,  // 사용자 이메일
                buyer_name: userCookie.name,    // 사용자 이름
                amount: paymentData.paid_amount, // 결제 금액
                status: paymentData.status,     // 결제 상태
                imp_uid: paymentData.imp_uid,   // 아임포트 거래 고유번호
            }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('결제 내역 저장 성공:', data);
        })
        .catch(error => {
            console.error('결제 내역 저장 실패:', error);
        });
    }


    return (
        <>
            <hr></hr>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-xs" data-v0-t="card">
                <div className="flex flex-col space-y-1.5 p-6">
                    <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Payment Summary</h3>
                </div>
                <div className="p-6 grid gap-4">
                    {dayschedule.map((contents, index) => (
                        <div className="grid gap-1">
                            <div className="text-sm text-muted-foreground">{contents.day_date.substring(5, 10)}</div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{contents.dtitle}</span>
                                <span className="text-sm font-medium">{contents.price}</span>
                            </div>

                        </div>
                    ))}


                    <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full"></div>
                    <hr></hr>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Total</span>
                    </div>
                </div>
            </div>

            <div
                className=" text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32"
                style={{ backgroundColor: '#1e90ff' }}
                onClick={requestPay}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                    <path d="M3 10l18 0" />
                    <path d="M7 15l.01 0" />
                    <path d="M11 15l2 0" />
                </svg>
                <span className="text-xl font-bold">결제</span>
            </div>
        </>
    )
}

export default Pay;