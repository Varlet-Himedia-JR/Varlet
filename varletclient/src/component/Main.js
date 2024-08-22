import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Heading from './headerfooter/Heading';
import Footer from './headerfooter/Footer';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../style/main.css';
import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";

function Main() {
  const [reviews, setReviews] = useState([]); // 리뷰 목록
  const [images, setImages] = useState([]); // 슬라이더에 사용할 이미지 목록
  const [page, setPage] = useState(1); // 페이지 번호
  const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
  const navigate = useNavigate();
  const userCookie = getCookie('user');
  const [recentContents, setRecentContents] = useState([]);

  console.log('userCookie:', userCookie);
  // 슬라이더 설정
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500
  };

  const testimages = [
    "https://via.placeholder.com/600x400?text=Slide+1",
    "https://via.placeholder.com/600x400?text=Slide+2",
    "https://via.placeholder.com/600x400?text=Slide+3",
  ];

  // 리뷰 데이터 로드 함수
  const loadReviews = useCallback(async (pageNumber) => {
    try {
      const result = await axios.get(`/api/review/reviewList/${pageNumber}`);
      const { reviewList: newReviews, paging } = result.data;

      // 조회수 200 이상인 리뷰만 필터링
      const filteredReviews = newReviews.filter(review => review.readcount >= 200);

      if (filteredReviews.length > 0) {
        setReviews(prevReviews => {
          // 최신 5개 리뷰만 유지
          const sortedReviews = [...prevReviews, ...filteredReviews]
            .sort((a, b) => new Date(b.indate) - new Date(a.indate));
          return sortedReviews.slice(0, 5);
        });
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

  useEffect(() => {
    const result = axios.get('/api/contents/recentContentsList')
      .then((result) => {
        setRecentContents(result.data.recentContentsList)
        console.log(recentContents);

      })
      .catch((err) => { console.error(err); });
  }, []);

  // 이미지 데이터 로드 함수
  useEffect(() => {
    axios.get('/api/review/reviewList')
      .then((result) => {
        const reviewData = result.data.review;

        // 조회수가 200 이상인 리뷰의 첫 번째 이미지 URL만 필터링
        if (reviewData && reviewData.length > 0) {
          const filteredImages = reviewData
            .filter(review => review.readcount >= 200 && review.reviewimg) // 조회수가 200 이상이고 이미지가 있는 리뷰만 필터링
            .map(review => `http://localhost:8070/images/${review.reviewimg}`); // 이미지 URL 설정

          setImages(filteredImages);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

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

  // 리뷰 제목 클릭 핸들러
  function onReviewView(rseq) {
    navigate(`/reviewView/${rseq}`);
  }

  // 상세보기로 이동
  function getContentsView(cseq) {
    navigate(`/getContentsView/${cseq}`);
  }

  return (
    <>
      <Heading />
      <div className="flex min-h-[100dvh] flex-col">
        <section className="w-full bg-gradient-to-r from-[#1e90ff] to-[#1e90ff] py-20 md:py-32" style={{
          backgroundImage: 'url(http://localhost:8070/images/oceans.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',   // 원하는 너비 설정
          zIndex: 0
        }}>

          <div className="container  mx-auto flex flex-col items-center justify-center gap-8 px-4 md:flex-row md:gap-12"
          >
            <div className="max-w-xl space-y-4 text-center md:text-left bg-gradient-to-r from-[#1e90ff] to-[#1e90ff]" >
              <h1 className="text-4xl font-bold tracking-tighter text-white sm:text-5xl md:text-6xl">
                Welcome to the Trip Community
              </h1>
              <p className="text-lg text-white md:text-xl">
                Connect with fellow travelers, share your experiences, and plan your next adventure.
              </p>
              <div className="flex justify-center md:justify-start">
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 rounded-md px-8">
                  Join Now
                </button>
              </div>
              <div>
                <h2>Image Slider</h2>
                <Slider {...sliderSettings}>
                  {recentContents.map((contents, index) => (
                    <div key={index}>
                      <img src={contents.contentsimg} alt={`Slide ${index + 1}`} style={{ width: '600px', height: '400px' }} onClick={() => { getContentsView(contents.cseq) }} />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>

            {/* <img
              src="https://via.placeholder.com/600x400?text=Slide+1"
              width="600"
              height="400"
              alt="Trip Community"
              style={{ aspectRatio: '600 / 400', objectFit: 'cover' }}
              className="mx-auto w-full max-w-md rounded-xl object-cover md:mx-0"
            /> */}
          </div>
        </section>
        <section className="w-full bg-[#F0F8FF] py-16 md:py-24">
          <div className="container mx-auto grid grid-cols-1 gap-8 px-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-[#1e90ff]"
              >
                <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
                <path d="M15 5.764v15"></path>
                <path d="M9 3.236v15"></path>
              </svg>
              <h3 className="text-xl font-bold">Explore the World</h3>
              <p className="text-[#808080]">
                Discover new destinations, plan your trips, and connect with like-minded travelers.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-[#1e90ff]"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <h3 className="text-xl font-bold">Build Your Network</h3>
              <p className="text-[#808080]">Connect with fellow travelers, share your experiences, and make new friends.</p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-[#1e90ff]"
              >
                <path d="M8 2v4"></path>
                <path d="M16 2v4"></path>
                <rect width="18" height="18" x="3" y="4" rx="2"></rect>
                <path d="M3 10h18"></path>
              </svg>
              <h3 className="text-xl font-bold">Plan Your Trips</h3>
              <p className="text-[#808080]">Easily plan and organize your upcoming trips with our intuitive tools.</p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-[#1e90ff]"
              >
                <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                <circle cx="12" cy="13" r="3"></circle>
              </svg>
              <h3 className="text-xl font-bold">Share Your Memories</h3>
              <p className="text-[#808080]">Capture and share your travel experiences with the community.</p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-[#1e90ff]"
              >
                <path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>
                <circle cx="12" cy="12" r="10"></circle>
              </svg>
              <h3 className="text-xl font-bold">Get Travel Advice</h3>
              <p className="text-[#808080]">
                Tap into the collective wisdom of the community and get personalized travel tips.
              </p>
            </div>
            <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-6 shadow-md transition-all hover:scale-105 hover:shadow-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-12 w-12 text-[#1e90ff]"
              >
                <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                <rect width="20" height="14" x="2" y="6" rx="2"></rect>
              </svg>
              <h3 className="text-xl font-bold">Discover Travel Deals</h3>
              <p className="text-[#808080]">Find exclusive travel deals and discounts curated by the community.</p>
            </div>
          </div>
        </section>
        <section className="w-full bg-[#F0F8FF] py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h2 className="text-3xl font-bold tracking-tighter text-[#333333] sm:text-4xl">What Our Members Say</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <blockquote className="rounded-lg bg-white p-6 shadow-md">
                  <div className="flex items-center gap-4">
                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">JD</span>
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold">John Doe</h4>
                      <p className="text-[#808080]">Frequent Traveler</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[#808080]">
                    "The Trip Community has been a game-changer for me. I've connected with so many
                    like-minded travelers and discovered amazing destinations I never would have
                    found on my own."
                  </p>
                </blockquote>
                <blockquote className="rounded-lg bg-white p-6 shadow-md">
                  <div className="flex items-center gap-4">
                    <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
                      <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">JS</span>
                    </span>
                    <div>
                      <h4 className="text-lg font-semibold">Jane Smith</h4>
                      <p className="text-[#808080]">Adventure Seeker</p>
                    </div>
                  </div>
                  <p className="mt-4 text-[#808080]">"I've been a member of the Trip Community for years and it continues to inspire me."</p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className='review-section'>
        <h2>HOT REVIEW</h2>
        <div className="review-list">
          {/* <Slider {...sliderSettings}>
            {reviews.length > 0 ? (
              reviews.map((review, idx) => (
                <div className="review-card" key={idx}>
                  <div className="review-title">제목: {review.title}</div>
                  <div className="review-date">작성날짜: {review.indate ? review.indate.toString().substring(0, 10) : ''}</div>
                  <div className="review-readcount">조회수: {review.readcount}</div>
                </div>
              ))
            ) : (
              <div>리뷰가 없습니다.</div>
            )}
          </Slider> */}
          {reviews.length > 0 ? (
            reviews.map((review, idx) => (
              <div className="review-card" key={idx}>
                <div className="review-header">
                  <div className="review-id">번호: {review.rseq}</div>
                  <div className="review-user" onClick={() => onReviewView(review.rseq)}>
                    작성자: {review.userid}
                  </div>
                </div>
                <div className="review-title">제목: {review.title}</div>
                <div className="review-date">작성날짜: {review.indate ? review.indate.toString().substring(0, 10) : ''}</div>
                <div className="review-readcount">조회수: {review.readcount}</div>
              </div>
            ))
          ) : (
            <div>리뷰가 없습니다.</div>
          )}
        </div>
      </div>
      {/* <div style={{ paddingTop: '100px' }}>
        <div className='background'>
          <img src="http://localhost:8070/images/oceans.jpg" alt="Background" />
        </div>
        <div className='main'>
          
          
        </div>
      </div> */}
      <Footer />
    </>
  );
}

export default Main;
