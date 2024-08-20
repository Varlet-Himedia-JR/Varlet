import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import Heading from './headerfooter/Heading';
import Footer from './headerfooter/Footer';
import { loginAction, logoutAction } from '../store/userSlice';
import jaxios from '../util/jwtUtil';

import { setCookie, getCookie, removeCookie } from "../util/cookieUtil";
import '../style/main.css'

function Main() {
  const [loginUser, setLoginUser] = useState({});
  const lUser = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [review, setReview] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const { rseq } = useParams();

  // useEffect(() => {
  //   // 리뷰 데이터 로드
  //   axios.get(`/api/review/getReviewView/${rseq}`)
  //       .then((result) => {
  //           const reviewData = result.data.review;
  //           setReview(reviewData);
            
  //           // 리뷰 이미지 URL 설정
  //           if (reviewData.reviewimg) {
  //               setPreviewImage(`http://localhost:8070/images/${reviewData.reviewimg}`);
  //           }
  //       })
  //       .catch((err) => {
  //           console.error(err);
  //           setReview({});
  //       });
  // }, [rseq]); // rseq가 변경될 때마다 실행되도록 설정
  
  return (
    <>
      <Heading/>
      <div style={{ paddingTop: '100px' }}>
        <div className='background'><img src="http://localhost:8070/images/oceans.jpg" alt="Background" /></div>
        <div className='main'>
          <div className='best'>
            BEST
          </div>
          <div className='field'>
            <label>Image</label>
            {previewImage ? (
              <img src={previewImage} alt="Review" style={{ maxWidth: '300px', maxHeight: '300px' }} />
            ) : (
              <div>No image available</div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </>
  )
}

export default Main
