import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Heading from './headerfooter/Heading';
import Footer from './headerfooter/Footer';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../style/main.css';

function Main() {
  const [images, setImages] = useState([]); // 슬라이더에 사용할 이미지 목록

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500
  };

  useEffect(() => {
    // 리뷰 데이터 로드
    axios.get('/api/review/reviewList')
      .then((result) => {
        const reviewData = result.data.review;

        // 조회수가 200 이상인 리뷰의 첫 번째 이미지 URL만 필터링
        if (reviewData && reviewData.length > 0) {
          const filteredImages = reviewData
            .filter(review => review.views >= 200 && review.reviewimg) // 조회수가 200 이상이고 이미지가 있는 리뷰만 필터링
            .map(review => `http://localhost:8070/images/${review.reviewimg}`); // 첫 번째 이미지 URL 설정
          
          setImages(filteredImages);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <Heading />
      <div style={{ paddingTop: '100px' }}>
        <div className='background'><img src="http://localhost:8070/images/oceans.jpg" alt="Background" /></div>
        <div className='main'>
          <div className='best'>BEST</div>
          <div className='field'>
            <div>
              <h2>최근 등록된 콘텐츠</h2>
              <div style={{ width: "600px", margin: "0 auto" }}>
                <Slider {...settings}>
                  {images.map((image, index) => (
                    <div key={index}>
                      <img src={image} alt={`Slide ${index + 1}`} style={{ width: "100%", height: "auto" }} />
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Main;
