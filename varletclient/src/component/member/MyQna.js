import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';

function MyQna() {
    const [qnaList, setQnaList] = useState([]);
    const [paging, setPaging] = useState({});
    const [beginend, setBeginend] = useState([]);
    const navigate = useNavigate();
    const user = useSelector(state => state.user); // 로그인한 사용자 정보 가져오기

    useEffect(() => {
        if (user && user.userid) {
            axios.get('/api/qna/qnaList/1', { params: { userid: user.userid } })
                .then((result) => {
                    setQnaList(result.data.qnaList);
                    setPaging(result.data.paging);

                    const pageArr = [];
                    for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                        pageArr.push(i);
                    }
                    setBeginend(pageArr);
                })
                .catch((err) => { console.error(err); });
        }
    }, [user]);

    function onPageMove(page) {
        if (user && user.userid) {
            axios.get(`/api/qna/qnaList/${page}`, { params: { userid: user.userid } })
                .then((result) => {
                    setQnaList([...result.data.qnaList]);
                    setPaging(result.data.paging);

                    const pageArr = [];
                    for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                        pageArr.push(i);
                    }
                    setBeginend([...pageArr]);
                })
                .catch((err) => { console.error(err); });
        }
    }

    async function onQnaView(qseq) {
        let result = await axios.get(`/api/qna/getQnaView/${qseq}`);
        if (result.data.qna.security === 'N') {
            navigate(`/qnaView/${qseq}`);
        } else {
            let inputPass = window.prompt('패스워드를 입력하세요', '');
            let res = await axios.post(`/api/qna/passCheck`, null, { params: { qseq, inputPass } });
            if (res.data.msg === 'OK') {
                navigate(`/QnaView/${qseq}`);
            } else {
                alert('패스워드가 일치하지 않습니다.');
            }
        }
    }

    return (
        <article>
            <Heading />
            <div className='subPage'>
                <div className="qnalist" style={{ flex: "4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h2>고객센터</h2>
                        <button onClick={() => { navigate('/writeQna') }}>1:1 문의 작성</button>
                    </div>
                    <div className="qnatable">
                        <div className="row">
                            <div className="col" style={{ flex: "2" }}>번호</div>
                            <div className="col" style={{ flex: "4" }}>제목</div>
                            <div className="col" style={{ flex: "2" }}>등록일</div>
                            <div className="col" style={{ flex: "2" }}>답변여부</div>
                        </div>
                    </div>
                    {qnaList.length > 0 ? (
                        qnaList.map((qna, idx) => (
                            <div className="row" key={idx}>
                                <div className="col" style={{ flex: "2" }}>{qna.qseq}</div>
                                <div className="col" style={{ flex: "4", textAlign: "left" }} onClick={() => { onQnaView(qna.qseq) }}>
                                    {qna.subject}
                                    {qna.security === 'Y' && (
                                        <img style={{ verticalAlign: "middle", marginLeft: "10px" }} src="http://localhost:8070/images/key.png" alt="Secure" />
                                    )}
                                </div>
                                <div className="col" style={{ flex: "2" }}>{qna.indate.substring(0, 10)}</div>
                                <div className="col" style={{ flex: "2" }}>
                                    {qna.reply ? (<div>답변완료</div>) : (<div>질문 확인 중</div>)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Q&A가 없습니다.</div>
                    )}
                    <div id="paging" style={{ textAlign: "center", padding: "10px" }}>
                        {paging.prev ? (
                            <span style={{ cursor: "pointer" }} onClick={() => { onPageMove(paging.beginPage - 1) }}>
                                ◀
                            </span>
                        ) : (
                            <span></span>
                        )}
                        {beginend.length > 0 ? (
                            beginend.map((page, idx) => (
                                <span
                                    style={{ cursor: "pointer", margin: "0 5px" }}
                                    key={idx}
                                    onClick={() => { onPageMove(page) }}
                                >
                                    {page}
                                </span>
                            ))
                        ) : (
                            <span>1</span>
                        )}
                        {paging.next ? (
                            <span style={{ cursor: "pointer" }} onClick={() => { onPageMove(paging.endPage + 1) }}>
                                ▶
                            </span>
                        ) : (
                            <span></span>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </article>
    );
}

export default MyQna;
