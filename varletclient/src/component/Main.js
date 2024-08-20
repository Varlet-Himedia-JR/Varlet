import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import Heading from './headerfooter/Heading';
import Footer from './headerfooter/Footer';
import { loginAction, logoutAction } from '../store/userSlice';
import jaxios from '../util/jwtUtil';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";
import '../style/main.css'

function Main() {
  const [loginUser, setLoginUser] = useState({});
  const lUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const [best]
  const images = [
    "https://via.placeholder.com/800x400?text=Slide+1",
    "https://via.placeholder.com/800x400?text=Slide+2",
    "https://via.placeholder.com/800x400?text=Slide+3",
    "https://via.placeholder.com/800x400?text=Slide+4",
  ];
  const settings = {
    dots: true, // 슬라이더 하단에 점을 표시
    infinite: true, // 무한 루프
    speed: 500, // 슬라이드 넘어가는 속도 (ms)
    slidesToShow: 1, // 한번에 보여줄 슬라이드 개수
    slidesToScroll: 1, // 스크롤 시 넘어가는 슬라이드 개수
    autoplay: true, // 자동 재생
    autoplaySpeed: 1500 // 자동 재생 시 슬라이드 간격 (ms)
  };

  return (
    <>
      <Heading />
      <div style={{ paddingTop: '100px' }}>
        <div className='background'><img src="http://localhost:8070/images/Beach.jpg" /></div>
        <div onClick={() => { navigate("/notice") }}><h2>공지사항</h2></div>
        <hr></hr>
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
        <br></br>
        <div>
          <h2>Best Review</h2>
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
        <br></br>
        <div>
          <h2 onClick={()=>{navigate('/testlist')}}>Test Component</h2>
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
      <Footer />
    </>
  )
}

export default Main
