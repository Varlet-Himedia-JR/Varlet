import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';
import { getCookie } from "../../util/cookieUtil";

function MyReview() {
    const [reviewList, setReviewList] = useState([]);
    const navigate = useNavigate();
    const userid = getCookie('user').userid;

    const loadReviews = useCallback(async () => {
        try {
            const result = await axios.get(`/api/review/userReviews/${userid}`);
            const reviews = result.data.reviewList;
            setReviewList(reviews);
            console.log("Updated reviewList: ", reviews);
        } catch (err) {
            console.error("Error loading reviews: ", err);
        }
    }, [userid]);

    useEffect(() => {
        if (userid) {
            loadReviews();
        }
    }, [loadReviews, userid]);

    function onReviewView(rseq) {
        navigate(`/reviewView/${rseq}`);
    }

    function handleAddReview() {
        navigate('/writeReview');
    }

    return (
        <>
            <Heading />
            <div className='reviewList' style={{ marginTop: '80px' }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h2 className="text-lg font-semibold">내가 작성한 리뷰</h2>
                    <button className="add-review-button" onClick={handleAddReview}>리뷰 작성</button>
                </div>
                <div className="space-y-4">
                    {Array.isArray(reviewList) && reviewList.length > 0 ? (
                        reviewList.map((review) => (
                            <div
                                key={review.rseq}
                                className="flex items-start space-x-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out rounded-lg p-4"
                                onClick={() => onReviewView(review.rseq)}
                                style={{ cursor: 'pointer' }}
                            >
                                <img
                                    src={review.ipath === '' ? 'https://via.placeholder.com/300' : `http://localhost:8070${review.ipath}`}
                                    className="w-[300px] h-[200px] object-cover"
                                    width="300"
                                    height="200"
                                    style={{ aspectRatio: '300 / 200', objectFit: 'cover' }}
                                    alt="Review Thumbnail"
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
                                        {review.readcount && (
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
                                        {review.indate && (
                                            <span className="text-xl text-muted-foreground">{review.indate.toString().substring(0, 10)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flex justify-center'>
                            <h2 className="text-lg font-semibold">작성한 리뷰가 없습니다.</h2>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MyReview;
