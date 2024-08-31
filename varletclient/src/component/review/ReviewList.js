import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';
import { getCookie } from "../../util/cookieUtil";

function ReviewList() {
    const [reviewList, setReviewList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
    const [searchTerm, setSearchTerm] = useState(''); // 검색어
    const [filteredReviews, setFilteredReviews] = useState([]);
    const navigate = useNavigate();
    

    const loadReviews = useCallback(async (pageNumber) => {
        try {
            const result = await axios.get(`/api/review/reviewPreviewList/${pageNumber}`);
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
                const result = await axios.get('/api/review/reviewPreviewSearch', {
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
        if(getCookie('user')){
            navigate('/writeReview'); // 리뷰 작성 페이지로 이동
        }else{
            navigate('/login'); // 리뷰 작성 페이지로 이동
        }
        
    }

    return (
        <>
            <Heading />
            <div className='reviewList' style={{ marginTop: '80px' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 className="text-lg font-semibold">여행 후기</h2>
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
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace cursor-pointer" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={handleClearSearch} >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                            <path d="M12 10l4 4m0 -4l-4 4" />
                        </svg>
                    )}
                </div>
                <div className="space-y-4">

                    {
                        Array.isArray(filteredReviews) && filteredReviews.length > 0 ? (
                            filteredReviews.map((review) => (
                                <div
                                    key={review.id}
                                    className="flex items-start space-x-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out rounded-lg p-4"
                                    onClick={() => onReviewView(review.rseq) } style={{cursor:'pointer'}}
                                >
                                    <img
                                        src={review.ipath === '' ? 'https://via.placeholder.com/300' : `http://localhost:8070${review.ipath}`}
                                        
                                        className="w-[300px] h-[200px] object-cover"
                                        width="300"
                                        height="200"
                                        style={{ aspectRatio: '300 / 200', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <h2 className="text-lg font-semibold">{review.title}</h2>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="relative flex h-50 w-10 shrink-0 overflow-hidden rounded-full">
                                                <svg
                                                    className="w-6 h-6 stroke-current"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path
                                                        d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z"
                                                        strokeWidth="0"
                                                        fill="currentColor"
                                                    />
                                                    <path
                                                        d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z"
                                                        strokeWidth="0"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                            </span>
                                            {review.userid && (
                                                <span className="text-xl text-muted-foreground">{review.userid}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="relative flex h-50 w-10 shrink-0 overflow-hidden rounded-full">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="icon icon-tabler icon-tabler-eye"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="#000000"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                                </svg>
                                            </span>
                                            {review.indate && (
                                                <span className="text-xl text-muted-foreground">{review.readcount}</span>
                                            )}
                                        </div>
                                        <div className="flex items-center space-x-2 mt-2">
                                            <span className="relative flex h-50 w-10 shrink-0 overflow-hidden rounded-full">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="icon icon-tabler icon-tabler-calendar-month"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="#000000"
                                                    fill="none"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 7a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12z" />
                                                    <path d="M16 3v4" />
                                                    <path d="M8 3v4" />
                                                    <path d="M4 11h16" />
                                                    <path d="M7 14h.013" />
                                                    <path d="M10.01 14h.005" />
                                                    <path d="M13.01 14h.005" />
                                                    <path d="M16.015 14h.005" />
                                                    <path d="M13.015 17h.005" />
                                                    <path d="M7.01 17h.005" />
                                                    <path d="M10.01 17h.005" />
                                                </svg>
                                            </span>
                                            {review.readcount && (
                                                <span className="text-xl text-muted-foreground">{review.indate.toString().substring(0, 10)}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <div className='flex justify-center'>
                                <h2 className="text-lg font-semibold">해당하는 리뷰가 없습니다.</h2>
                            </div>
                        )
                    }

                </div>
            </div>
            <Footer />
        </>
    );
}

export default ReviewList;
