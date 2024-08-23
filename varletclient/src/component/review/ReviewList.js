import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';

function ReviewList() {
    const [reviewList, setReviewList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
    const [searchTerm, setSearchTerm] = useState(''); // 검색어
    const [filteredReviews, setFilteredReviews] = useState([]);
    const navigate = useNavigate();

    const loadReviews = useCallback(async (pageNumber) => {
        try {
            const result = await axios.get(`/api/review/reviewList/${pageNumber}`);
            const { reviewList: newReviews, paging } = result.data;

            if (Array.isArray(newReviews) && newReviews.length > 0) {
                setReviewList(prevReviews => {
                    const combinedReviews = [...prevReviews, ...newReviews];
                    const uniqueReviews = Array.from(new Set(
                        combinedReviews.map(review => review.rseq))
                    ).map(rseq => combinedReviews.find(review => review.rseq === rseq));
                    return uniqueReviews;
                });
                
                setPage(pageNumber);
                
                if (!paging || (paging && paging.next === null)) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    const filterReviews = useCallback(async () => {
        try {
            if (searchTerm.trim() === '') {
                setFilteredReviews(reviewList);
            } else {
                const result = await axios.get('/api/review/reviewSearch', { 
                    params: { query: searchTerm }
                });
                const reviews = result.data.reviewList; // 서버 응답의 데이터 구조에 맞게 필드 수정
                setFilteredReviews(reviews); // 서버에서 받은 필터링된 결과를 상태에 저장
            }
        } catch (err) {
            console.error(err);
        }
    }, [searchTerm, reviewList]);

    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop; // 현재위치
        const scrollHeight = document.documentElement.scrollHeight; // 스크롤 가능한 크기
        const clientHeight = document.documentElement.clientHeight; // 내용물의 크기

        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
            loadReviews(page + 1);
        }
    }, [page, hasMore, loadReviews]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        loadReviews(page);
    }, [loadReviews, page]);

    useEffect(() => {
        filterReviews();
    }, [searchTerm, filterReviews]);

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleClearSearch() {
        setSearchTerm('');
    }

    function onReviewView(rseq) {
        navigate(`/reviewView/${rseq}`);
    }

    function handleAddReview() {
        navigate('/writeReview'); // 리뷰 작성 페이지로 이동
    }

    return (
        <>
            <Heading />
            <div >
            <div className='background'><img src="http://localhost:8070/images/oceans.jpg"/></div>
            </div>

            <div className='reviewList' style={{ flex: "4" }} >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                        <h2>Review List</h2>
                        <button className="add-review-button" onClick={handleAddReview}>리뷰 작성</button>
                    </div>
                    <div className="search-container" style={{ marginBottom: "20px" }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="제목 또는 작성자 아이디로 검색"
                        />
                        {searchTerm && (
                            <button className="clear-button" onClick={handleClearSearch}>
                                &times;
                            </button>
                        )}
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
                            Array.isArray(filteredReviews) && filteredReviews.length > 0 ? (
                                filteredReviews.map((review) => (
                                    <div className="row" key={review.rseq}>
                                        <div className="col">{review.rseq}</div>
                                        <div className="col" style={{ textAlign: "left", cursor: "pointer", textDecoration: "underline" }} onClick={() => onReviewView(review.rseq)}>
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

export default ReviewList;
