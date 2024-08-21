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

  return (
    <>
      <Heading />
      <div style={{ paddingTop: '100px' }}>
        <div className='background'>
          <img src="http://localhost:8070/images/oceans.jpg" alt="Background" />
        </div>
        <div className='main'>
          {/* 슬라이더 부분 */}
          {/* <div className='slider-section'>
            <h2>최근 등록된 콘텐츠</h2>
            <div className='slider-container'>
              <Slider {...sliderSettings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img src={image} alt={`Slide ${index + 1}`} className='slider-image' />
                  </div>
                ))}
              </Slider>
            </div>
          </div> */}

          {/* 리뷰 목록 부분 */}
          <div className='review-section'>
            <h2>HOT REVIEW</h2>
            <div className="review-list">
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
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Main;
