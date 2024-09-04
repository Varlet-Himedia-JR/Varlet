import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../util/cookieUtil";
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
function MyPayment() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userId = getCookie('user').userid;
    const navigate = useNavigate();

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
            <div class='Mypayments'style={{ marginTop: '80px' }}>
            <h2>결제 내역</h2>
            {payments.length === 0 ? (
                <p>결제 내역이 없습니다.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>거래 ID</th>
                            <th>이름</th>
                            <th>이메일</th>
                            <th>금액</th>
                            <th>상태</th>
                            <th>날짜</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map(payment => (
                            <tr key={payment.pseq}>
                                <td>{payment.merchantUid}</td>
                                <td>{payment.buyerName}</td>
                                <td>{payment.buyerEmail}</td>
                                <td>{payment.amount}</td>
                                <td>{payment.status}</td>
                                <td>{new Date(payment.indate).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                    
                </table>
                
            )}
            <button className="w-full py-3 mt-4 text-white bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] rounded-lg" type="button" onClick={() => { navigate('/') }}>
                                돌아가기
            </button>
            </div>
            <Footer/>
        </>
    );
}
export default MyPayment