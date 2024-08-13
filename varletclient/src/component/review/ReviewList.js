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
    const [filteredReviews, setFilteredReviews] = useState([]); // 필터된 리뷰 목록
    const navigate = useNavigate();

    // 데이터 로드 함수
    const loadReviews = useCallback(async (pageNumber) => {
        try {
            const result = await axios.get(`/api/review/reviewList/${pageNumber}`);
            const { reviewList: newReviews, paging } = result.data;

            if (Array.isArray(newReviews) && newReviews.length > 0) {
                setReviewList(prevReviews => [...prevReviews, ...newReviews]);
                setPage(pageNumber);

                // 다음 페이지가 없으면 hasMore를 false로 설정
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
            loadReviews(page + 1);
        }
    }, [page, hasMore, loadReviews]);

    // 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // 초기 데이터 로드
    useEffect(() => {
        loadReviews(page);
    }, [loadReviews, page]);

    // 검색어 변경 핸들러
    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    // 검색어가 변경될 때마다 필터링
    useEffect(() => {
        filterReviews();
    }, [searchTerm, filterReviews]);

    // 검색어 클리어 핸들러
    function handleClearSearch() {
        setSearchTerm('');
    }

    function onReviewView(rseq) {
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
                                &times; {/* 'X' 문자 */}
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
                    {/* 로딩 중 표시 */}
                    {hasMore && <div className="loading">Loading more reviews...</div>}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ReviewList;
