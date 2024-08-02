import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function ReviewList() {
    const [reviewList, setReviewList] = useState([]);
    const [paging, setPaging] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/review/reviewList/1') // 데이터 가져오기
            .then((result) => {
                setReviewList(result.data.reviewList); // 실제 데이터 구조에 맞게 수정
                setPaging(result.data.paging);
            })
            .catch((err) => { console.error(err); });
    }, []);

    function onPageMove(p) {
        axios.get(`/api/review/reviewList/${p}`)
            .then((result) => {
                let reviews = [...reviewList, ...result.data.reviewList];
                setReviewList(reviews);
                setPaging(result.data.paging);
            })
            .catch((err) => { console.error(err); });
    }

    // 스크롤을 통한 페이징 처리
    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight - 10;
            const scrollTop = document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            if (paging.page && (scrollTop + clientHeight >= scrollHeight)) {
                onPageMove(Number(paging.page) + 1);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [paging.page, reviewList]);

    // 리뷰 상세 페이지로 이동
    function onReviewView(rseq) {
        navigate(`/reviewView/${rseq}`);
    }

    return (
        <article>
            <div className='subPage'>
                <div className='reviewList' style={{ flex: "4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <h2>Review List</h2>
                        <button onClick={() => { navigate('/writeReview') }}>리뷰 작성</button>
                    </div>
                    <div className="ReviewTable">
                        <div className='row'>
                            <div className="col">번호</div>
                            <div className="col">작성자이름</div>
                            <div className="col">제목</div>
                            <div className="col">작성날짜</div>
                            <div className="col">조회수</div>
                        </div>
                        {
                            reviewList.length > 0 ? (
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
                </div>
            </div>
        </article>
    );
}

export default ReviewList;
