import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';

function ReviewList() {
    const [reviewList, setReviewList] = useState([]);
    const [paging, setPaging] = useState(null);  // 초기값을 null로 설정
    const [beginend, setBeginend] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/review/reviewList/1')
            .then((result) => {
                const { reviewList, paging } = result.data;
                setReviewList(Array.isArray(reviewList) ? reviewList : []);
                setPaging(paging || null);  // paging이 없으면 null로 설정
                
                // 페이지 배열 계산
                if (paging && paging.beginPage && paging.endPage) {
                    const pageArr = [];
                    for (let i = paging.beginPage; i <= paging.endPage; i++) {
                        pageArr.push(i);
                    }
                    setBeginend(pageArr);
                }
            })
            .catch((err) => { console.error(err); });
    }, []);

    function onPageMove(page) {
        axios.get(`/api/review/reviewList/${page}`)
            .then((result) => {
                const { reviewList, paging } = result.data;
                console.log(result.data);
                setReviewList(Array.isArray(reviewList) ? reviewList : []);
                setPaging(paging || null);  // paging이 없으면 null로 설정
                
                // 페이지 배열 계산
                if (paging && paging.beginPage && paging.endPage) {
                    const pageArr = [];
                    for (let i = paging.beginPage; i <= paging.endPage; i++) {
                        pageArr.push(i);
                    }
                    setBeginend(pageArr);
                }
            })
            .catch((err) => { console.error(err); });
    }

    function onReviewView(rseq) {
        navigate(`/reviewView/${rseq}`);
    }

    return (
        <article>
            <Heading />
            <div className='subPage'>
                <div className='reviewList' style={{ flex: "4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h2>Review List</h2>
                        <button onClick={() => { navigate('/writeReview') }}>리뷰 작성</button>
                    </div>
                    <div className="reviewtable">
                        <div className='row'>
                            <div className="col">번호</div>
                            <div className="col">작성자이름</div>
                            <div className="col">제목</div>
                            <div className="col">작성날짜</div>
                            <div className="col">조회수</div>
                        </div>
                        {
                            Array.isArray(reviewList) && reviewList.length > 0 ? (
                                reviewList.map((review, idx) => (
                                    <div className="row" key={idx}>
                                        <div className="col">{review.rseq}</div>
                                        <div className="col" style={{ textAlign: "left" }} onClick={() => onReviewView(review.rseq)}>
                                            {review.userid}
                                        </div>
                                        <div className="col">{review.title}</div>
                                        <div className="col">{review.indate ? review.indate.toString().substring(0, 10) : ''}</div>
                                        <div className="col">{review.readcount}</div>
                                    </div>
                                ))
                            ) : (
                                <div>리뷰가 없습니다.</div>
                            )
                        }
                    </div>
                    {/* 페이지 네비게이션 추가 */}
                    <div id="paging" style={{ textAlign: "center", padding: "10px" }}>
                        {
                            paging && paging.prev ? (
                                <span style={{ cursor: "pointer" }} onClick={() => { onPageMove(paging.beginPage - 1) }}>
                                    ◀
                                </span>
                            ) : (
                                <span></span>
                            )
                        }
                        {
                            beginend.length > 0 ? (
                                beginend.map((page, idx) => (
                                    <span
                                        key={idx}
                                        style={{ cursor: "pointer", margin: "0 5px" }}
                                        onClick={() => { onPageMove(page) }}
                                    >
                                        {page}
                                    </span>
                                ))
                            ) : (
                                <span>1</span>
                            )
                        }
                        {
                            paging && paging.next ? (
                                <span style={{ cursor: "pointer" }} onClick={() => { onPageMove(paging.endPage + 1) }}>
                                    ▶
                                </span>
                            ) : (
                                <span></span>
                            )
                        }
                    </div>
                </div>
            </div>
            <Footer />
        </article>
    );
}

export default ReviewList;
