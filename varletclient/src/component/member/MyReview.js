import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';
import { getCookie } from "../../util/cookieUtil";

function MyReview() {
    const [reviewList, setReviewList] = useState([]); // 리뷰 목록 상태
    const navigate = useNavigate();
    const userid = getCookie('user').userid; // 로그인한 사용자 ID

    // 데이터 로드 함수
    const loadReviews = useCallback(async () => {
        try {
            const result = await axios.get(`/api/review/userReviews/${userid}`);
            const reviews = result.data.reviewList;
            setReviewList(reviews);
            console.log("Updated reviewList: ", reviews); // 상태 업데이트 후 로그 출력
        } catch (err) {
            console.error("Error loading reviews: ", err);
        }
    }, [userid]);

    // 데이터 로드
    useEffect(() => {
        if (userid) {
            loadReviews();
        }
    }, [loadReviews, userid]);

    // 상태 업데이트 시점에 로그 확인
    useEffect(() => {
        console.log("Rendering with reviewList: ", reviewList);
    }, [reviewList]);

    function onReviewView(rseq) {
        navigate(`/reviewView/${rseq}`);
    }

    return (
        <>
            <Heading />
            <div >
            <div className='background'><img src="http://localhost:8070/images/oceans.jpg"/></div>
            </div>
                <div className='reviewList' style={{ flex: "4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <div className='reviewcenter'>MY REVIEW</div>
                        <button className='review-button' onClick={() => { navigate('/writeReview') }}>리뷰 작성</button>
                    </div>
                    <div className="reviewtable">
                        <div className='row'>
                            <div className="col">번호</div>
                            <div className="col">작성자</div>
                            <div className="col">제목</div>
                            <div className="col">작성날짜</div>
                            <div className="col">조회수</div>
                        </div>
                        {
                            Array.isArray(reviewList) && reviewList.length > 0 ? (
                                reviewList.map((review, idx) => (
                                    <div className="row" key={review.rseq}>
                                        <div className="col">{reviewList.length - idx}</div> {/* 역순 번호 표시 */}
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
                </div>
            <Footer />
        </>
    );
}

export default MyReview;
