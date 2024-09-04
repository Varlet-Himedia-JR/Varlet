import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../util/cookieUtil";
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import '../../style/mypayments.css';
function MyPayment() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = getCookie('user').userid;
    const navigate = useNavigate();
    const statusMessages = {
        paid: "결제완료",
        cancelled: "결제취소",
        failed: "결제실패"
    };

    useEffect(() => {
        // 사용자의 결제 내역을 서버에서 가져옵니다.
        const userId = getCookie('user').userid;
        axios.get(`/api/pay/payments/${userId}`)
            .then(response => {
                setPayments(response.data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [userId]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <>
            <Heading/>
            <div class='PaymentPage'style={{ marginTop: '80px' }}>
            <div className='payment'>결제 내역</div>
              <div style={{display:"flex",justifyContent:"space-between",paddingTop:"30px"}}>
              </div>
                  <div className="noticeTable">
                      <div className="payment_row">
                          <div className="payment_col" style={{flex:"2.8"}}>주문번호</div>
                          <div className="payment_col" style={{flex:"3"}}>이름</div>
                          <div className="payment_col" style={{flex:"3"}}>이메일</div>
                          <div className="payment_col" style={{flex:"2"}}>금액</div>
                          <div className="payment_col" style={{flex:"3"}}>상태</div>
                          <div className="payment_col" style={{flex:"3"}}>날짜</div>
                      </div>
                  </div>
               {
                  (payments)?(
                    payments.map((payment,idx)=>{
                          // 상태 메시지 변환
                          const statusMessage = statusMessages[payment.status] || payment.status;
                          const formattedAmount = payment.amount.toLocaleString();
                          return(
                              <div className="notice_row2" key={idx}>
                                  <div className="payment_coll"  style={{flex:"3"}} >{payment.merchantUid}</div>
                                  <div className="payment_coll"  style={{flex:"2"}} >{payment.buyerName}</div>
                                  <div className="payment_coll"  style={{flex:"2"}} >{payment.buyerEmail}</div>
                                  <div className="payment_coll"  style={{flex:"2"}} >{formattedAmount}</div>
                                  <div className="payment_coll"  style={{flex:"2"}} >{statusMessage}</div>
                                  <div className="payment_coll"  style={{flex:"5"}} >{new Date(payment.indate).toLocaleString()}</div>
                              </div>
                            )
                      })
                  ):(null)
               }
                <button className="w-40 py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" type="button" onClick={() => { navigate('/') }}>
                    홈으로
                </button>
            </div>
                <Footer/>
                
            </>
        );
}
export default MyPayment