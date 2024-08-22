import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

function Payment({ daySchedule }) {

    const [dayschedule, setDayschedule] = useState([]);
    // 결제 함수
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
            amount: dayschedule[0].price,  // 오류 방지를 위해 기본값 0 설정
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
    //---------------------------------

    useEffect(() => {
        if (daySchedule && daySchedule.length > 0) {
            setDayschedule(daySchedule);
        }
    }, [daySchedule]);

    return (
        <>
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
            <br></br>
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

export default Payment
