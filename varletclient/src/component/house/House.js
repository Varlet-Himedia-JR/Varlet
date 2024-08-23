// import React, { useEffect, useRef,useState } from 'react';
// import Heading from '../headerfooter/Heading';
// import Footer from '../headerfooter/Footer';
// import '../../style/house.css';

// function House() {
//   const mapRef = useRef(null);
//   const searchInputRef = useRef(null); // 검색 입력 필드에 대한 ref
//   const [mapLoaded, setMapLoaded] = useState(false); // 상태 추가
//   const markers = useRef([]); // 마커를 담을 배열을 useRef로 설정
//   const infowindow = useRef(null); // 인포윈도우를 useRef로 설정
  
//     useEffect(() => {
//       const { kakao } = window;
//       const defaultLat = 37.5665; // 서울 시청의 위도
//       const defaultLon = 126.9780; // 서울 시청의 경도
  
//       // 사용자의 위치를 사용하거나 기본 위치로 지도를 생성하는 함수
//       const loadMap = (lat, lon, addMarker = false) => {
//         const container = mapRef.current; // 지도를 표시할 div
//         const options = {
//           center: new window.kakao.maps.LatLng(lat, lon), // 중심 좌표 설정
//           level: 13, // 확대 레벨
//         };
  
//         // 지도 생성
//         const map = new window.kakao.maps.Map(container, options);

//         // 지도를 클릭한 위치에 표출할 마커입니다
//         var marker = new kakao.maps.Marker({}); 
//         // 지도에 마커를 표시합니다
//         marker.setMap(map);


//         // 지도에 클릭 이벤트를 등록합니다
//         // 지도를 클릭하면 마지막 파라미터로 넘어온 함수를 호출합니다
//         kakao.maps.event.addListener(map, 'click', function(mouseEvent) {        
          
//           // 클릭한 위도, 경도 정보를 가져옵니다 
//           var latlng = mouseEvent.latLng; 
          
//           // 마커 위치를 클릭한 위치로 옮깁니다
//           marker.setPosition(latlng);
          
//         });
//       };

// const container = mapRef.current; // 지도를 표시할 div
// const options = {
//   center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 중심 좌표 설정
//   level: 13, // 확대 레벨
// };

// // 지도를 생성합니다    
// var map = new kakao.maps.Map(container, options); 

//       // 장소 검색 객체를 생성합니다
// var ps = new kakao.maps.services.Places();  

// // 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
// var infowindow = new kakao.maps.InfoWindow({zIndex:1});

// // 키워드로 장소를 검색합니다
// searchPlaces(map);

// // 키워드 검색을 요청하는 함수입니다
// function searchPlaces(map) {
//   const { kakao } = window;
//   const ps = new kakao.maps.services.Places();
//   const keyword = searchInputRef.current.value;

//     if (!keyword.trim()) {
//         alert('키워드를 입력해주세요!');
//         return;
//     }
// }

// // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
// function placesSearchCB(data, status, pagination) {
//     if (status === kakao.maps.services.Status.OK) {

//         // 정상적으로 검색이 완료됐으면
//         // 검색 목록과 마커를 표출합니다
//         displayPlaces(data);

//         // 페이지 번호를 표출합니다
//         displayPagination(pagination);

//     } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
//         alert('검색 결과가 존재하지 않습니다.');
//         return;
//     } else if (status === kakao.maps.services.Status.ERROR) {
//         alert('검색 결과 중 오류가 발생했습니다.');
//         return;

//     }
// }

// // 검색 결과 목록과 마커를 표출하는 함수입니다
// function displayPlaces(places) {

//     var listEl = document.getElementById('placesList'), 
//     menuEl = document.getElementById('menu_wrap'),
//     fragment = document.createDocumentFragment(), 
//     bounds = new kakao.maps.LatLngBounds(), 
//     listStr = '';
    
//     // 검색 결과 목록에 추가된 항목들을 제거합니다
//     removeAllChildNods(listEl);

//     // 지도에 표시되고 있는 마커를 제거합니다
//     removeMarker();
    
//     for ( var i=0; i<places.length; i++ ) {

//         // 마커를 생성하고 지도에 표시합니다
//         var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
//             marker = addMarker(placePosition, i), 
//             itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

//         // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
//         // LatLngBounds 객체에 좌표를 추가합니다
//         bounds.extend(placePosition);

//         // 마커와 검색결과 항목에 mouseover 했을때
//         // 해당 장소에 인포윈도우에 장소명을 표시합니다
//         // mouseout 했을 때는 인포윈도우를 닫습니다
//         (function(marker, title) {
//             kakao.maps.event.addListener(marker, 'mouseover', function() {
//                 displayInfowindow(marker, title);
//             });

//             kakao.maps.event.addListener(marker, 'mouseout', function() {
//                 infowindow.close();
//             });

//             itemEl.onmouseover =  function () {
//                 displayInfowindow(marker, title);
//             };

//             itemEl.onmouseout =  function () {
//                 infowindow.close();
//             };
//         })(marker, places[i].place_name);

//         fragment.appendChild(itemEl);
//     }

//     // 검색결과 항목들을 검색결과 목록 Element에 추가합니다
//     listEl.appendChild(fragment);
//     menuEl.scrollTop = 0;

//     // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
//     map.setBounds(bounds);
// }

// // 검색결과 항목을 Element로 반환하는 함수입니다
// function getListItem(index, places) {

//     var el = document.createElement('li'),
//     itemStr = '<span class="markerbg marker_' + (index+1) + '"></span>' +
//                 '<div class="info">' +
//                 '   <h5>' + places.place_name + '</h5>';

//     if (places.road_address_name) {
//         itemStr += '    <span>' + places.road_address_name + '</span>' +
//                     '   <span class="jibun gray">' +  places.address_name  + '</span>';
//     } else {
//         itemStr += '    <span>' +  places.address_name  + '</span>'; 
//     }
                 
//       itemStr += '  <span class="tel">' + places.phone  + '</span>' +
//                 '</div>';           

//     el.innerHTML = itemStr;
//     el.className = 'item';

//     return el;
// }

// // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
// function addMarker(position, idx, title) {
//     var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
//         imageSize = new kakao.maps.Size(36, 37),  // 마커 이미지의 크기
//         imgOptions =  {
//             spriteSize : new kakao.maps.Size(36, 691), // 스프라이트 이미지의 크기
//             spriteOrigin : new kakao.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
//             offset: new kakao.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
//         },
//         markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
//             marker = new kakao.maps.Marker({
//             position: position, // 마커의 위치
//             image: markerImage 
//         });

//     marker.setMap(map); // 지도 위에 마커를 표출합니다
//     markers.push(marker);  // 배열에 생성된 마커를 추가합니다

//     return marker;
// }

// // 지도 위에 표시되고 있는 마커를 모두 제거합니다
// function removeMarker() {
//     for ( var i = 0; i < markers.length; i++ ) {
//         markers[i].setMap(null);
//     }   
//     markers = [];
// }

// // 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
// function displayPagination(pagination) {
//     var paginationEl = document.getElementById('pagination'),
//         fragment = document.createDocumentFragment(),
//         i; 

//     // 기존에 추가된 페이지번호를 삭제합니다
//     while (paginationEl.hasChildNodes()) {
//         paginationEl.removeChild (paginationEl.lastChild);
//     }

//     for (i=1; i<=pagination.last; i++) {
//         var el = document.createElement('a');
//         el.href = "#";
//         el.innerHTML = i;

//         if (i===pagination.current) {
//             el.className = 'on';
//         } else {
//             el.onclick = (function(i) {
//                 return function() {
//                     pagination.gotoPage(i);
//                 }
//             })(i);
//         }

//         fragment.appendChild(el);
//     }
//     paginationEl.appendChild(fragment);
// }

// // 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// // 인포윈도우에 장소명을 표시합니다
// function displayInfowindow(marker, title) {
//     var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

//     infowindow.setContent(content);
//     infowindow.open(map, marker);
// }

//  // 검색결과 목록의 자식 Element를 제거하는 함수입니다
// function removeAllChildNods(el) {   
//     while (el.hasChildNodes()) {
//         el.removeChild (el.lastChild);
//     }
// }
      

      
//       // Geolocation API를 통해 사용자의 현재 위치를 가져옴
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const lat = position.coords.latitude;  // 위도
//             const lon = position.coords.longitude; // 경도
//             loadMap(lat, lon); // 현재 위치로 지도 로드
//             setMapLoaded(true); // 지도 로드 완료 상태 설정
//           },
//           (error) => {
//             console.error("지도위치 오류 ", error);
//             loadMap(defaultLat, defaultLon); // 오류 발생 시 기본 위치로 지도 로드
//             setMapLoaded(true); // 지도 로드 완료 상태 설정
//           }
//         );
//       } else {
//         // Geolocation을 지원하지 않는 경우 기본 위치로 지도 로드
//         alert("Geolocation을 사용할 수 없습니다. 기본 위치로 지도를 표시합니다.");
//         loadMap(defaultLat, defaultLon); // 기본 위치로 지도 로드
//         setMapLoaded(true); // 지도 로드 완료 상태 설정
//       }

      
//     }, []);
  

//   return (
//     <>
//     <Heading />
//     <div style={{ paddingTop: '100px' }}>
//       <div className='background'>
//         <img src="http://localhost:8070/images/oceans.jpg" alt="Background" />
//       </div>
//       <div className='main'>
//         <div className='houseTitle'>숙소 찾아보기</div>
//         <input ref={searchInputRef} type="text" id="keyword" placeholder="검색어를 입력하세요" />
//         <button onClick={() => searchPlaces(mapRef.current)}>검색</button>
//         <div id="map" ref={mapRef} style={{ width: '1350px', height: '700px' }} />
//         <div id="menu_wrap" className="menu_wrap">
//           <ul id="placesList"></ul>
//           <div id="pagination"></div>
//         </div>
//       </div>
//     </div>
//     <Footer />
//   </>
// );
// }
// export default House;
