import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import jaxios from '../../util/jwtUtil';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import { getCookie } from "../../util/cookieUtil";
import '../../style/review.css';

function ReviewList() {
    const [reviewList, setReviewList] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredReviews, setFilteredReviews] = useState([]);
    const navigate = useNavigate();

    const userCookie = getCookie('user');
    const userid = userCookie?.userid || null;

    // 데이터 로드 함수
    const loadReviews = useCallback(async () => {
        if (isLoading || !hasMore) return;

        setIsLoading(true); // 로딩 상태를 true로 설정
        try {
            const result = await jaxios.get(`/api/review/reviewList/${page}`);
            const { reviewList: newReviews, paging } = result.data;

            if (newReviews && newReviews.length > 0) {
                setReviewList(prevReviews => [...prevReviews, ...newReviews]);
                setPage(prevPage => prevPage + 1); // 페이지 증가
                if (!paging || paging.next === null) {
                    setHasMore(false); // 다음 페이지가 없으면 더 로드할 데이터 없음
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false); // 로딩 상태를 false로 설정
        }
    }, [page, isLoading, hasMore]);

    // 필터링 함수
    const filterReviews = useCallback(() => {
        if (searchTerm.trim() === '') {
            setFilteredReviews(reviewList);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = reviewList.filter(review =>
                review.title.toLowerCase().includes(lowercasedTerm) ||
                review.userid.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredReviews(filtered);
        }
    }, [searchTerm, reviewList]);

    // 스크롤 이벤트 핸들러
    const handleScroll = useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // 스크롤이 페이지 하단에 도달했을 때
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
            loadReviews(); // 다음 페이지 로드
        }
    }, [loadReviews, hasMore]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // 초기 데이터 로드
    useEffect(() => {
        loadReviews(); // 첫 페이지 데이터 로드
    }, []); // 빈 배열을 의존성 배열로 지정하여 첫 로딩 시 한 번만 실행

    useEffect(() => {
        filterReviews(); // 검색어가 변경될 때마다 필터링
    }, [searchTerm, filterReviews]);

    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    function handleClearSearch() {
        setSearchTerm('');
    }

    function onReviewView(rseq) {
        if (!userid) {
            alert('로그인이 필요합니다');
            navigate('/login');
            return;
        }
        navigate(`/reviewView/${rseq}`);
    }

    return (
        <>
            <Heading />
            <div className='subPage' style={{ paddingTop: '100px' }}>
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
                                filteredReviews.map((review, idx) => (
                                    <div className="row" key={idx}>
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
                    {isLoading && <div className="loading">Loading more reviews...</div>}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ReviewList;
