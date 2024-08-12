import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil'; // 쿠키 유틸리티 임포트
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';

function MyReview() {
    const [reviewList, setReviewList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReviews, setFilteredReviews] = useState([]);
    const navigate = useNavigate();

    // 로그인된 사용자 ID 가져오기 (쿠키에서)
    const userid = getCookie('userid'); // 쿠키에서 userid 가져오기

    const loadReviews = useCallback(async (pageNumber) => {
        try {
            const result = await axios.get(`/api/review/reviewList/${pageNumber}`, {
                params: { userid } // 사용자 ID를 쿼리 파라미터로 전달
            });
            const { reviewList: newReviews, paging } = result.data;

            if (Array.isArray(newReviews) && newReviews.length > 0) {
                setReviewList(prevReviews => [...prevReviews, ...newReviews]);
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
    }, [userid]);

    const filterReviews = useCallback(() => {
        if (searchTerm.trim() === '') {
            setFilteredReviews(reviewList);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = reviewList.filter(review =>
                review.title.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredReviews(filtered);
        }
    }, [searchTerm, reviewList]);

    const handleScroll = useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

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

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    useEffect(() => {
        filterReviews();
    }, [searchTerm, filterReviews]);

    function handleClearSearch() {
        setSearchTerm('');
    }

    function onReviewView(rseq) {
        navigate(`/reviewView/${rseq}`);
    }

    return (
        <article>
            <Heading />
            <div className='subPage'>
                <div className='reviewList' style={{ flex: "4" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <h2>Review List</h2>
                        <button onClick={() => { navigate('/writeReview') }}>리뷰 작성</button>
                    </div>
                    <div className="search-container" style={{ marginBottom: "20px" }}>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="제목으로 검색"
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
                                filteredReviews.map((review, idx) => (
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
                    {hasMore && <div className="loading">Loading more reviews...</div>}
                </div>
            </div>
            <Footer />
        </article>
    );
}

export default MyReview;
