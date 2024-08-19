import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import { getCookie } from '../../util/cookieUtil';
import moment from 'moment';
import { Map, CustomOverlayMap } from "react-kakao-maps-sdk";

const {kakao} = window;

function RcCommunityWrite() {


  useEffect(() =>{
    const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
    const options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
    level: 3 //지도의 레벨(확대, 축소 정도)
    };
    const map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴  
  })
 
 
  return (
    <div id='map' style={{
      width: '500px',
      height: '360px',
      position: 'absolute',
      top: '100px',
      left: '50%',
      transform: 'translateX(-50%)'  // centering the map in the container  // centering the map in the container   // centering the map in the container   // centering the map in the container   // centering the map in the container   // centering the map in the container   // centering the
    }}>
    
  </div>
  )
}

export default RcCommunityWrite