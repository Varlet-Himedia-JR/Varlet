// // src/request/KakaoMap.js

// import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';

// const KakaoMap = forwardRef(({ searchKeyword }, ref) => {
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState([]);
//   const [places, setPlaces] = useState([]); // 검색 결과를 리스트로 관리
//   const [selectedLocation, setSelectedLocation] = useState(null);

//   useImperativeHandle(ref, () => ({
//     searchPlaces: () => {
//       if (map && searchKeyword) {
//         const ps = new window.kakao.maps.services.Places();
//         ps.keywordSearch(searchKeyword, (data, status) => {
//           if (status === window.kakao.maps.services.Status.OK) {
//             // 기존 마커 제거
//             markers.forEach(marker => marker.setMap(null));
//             setMarkers([]);

//             const bounds = new window.kakao.maps.LatLngBounds();
//             const newMarkers = data.map(place => {
//               const position = new window.kakao.maps.LatLng(place.y, place.x);
//               const marker = new window.kakao.maps.Marker({
//                 map,
//                 position,
//               });
//               bounds.extend(position);
//               window.kakao.maps.event.addListener(marker, 'click', () => {
//                 setSelectedLocation(place);
//               });
//               return marker;
//             });

//             setMarkers(newMarkers);
//             setPlaces(data); // 리스트 업데이트
//             map.setBounds(bounds);
//           } else {
//             alert('검색 결과가 없습니다.');
//           }
//         });
//       }
//     },
//     getSelectedLocation: () => selectedLocation,
//   }));

//   useEffect(() => {
//     const script = document.createElement('script');
//     script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=c9654a57355ed5a994f6a30be622596f&libraries=services&autoload=false`;
//     script.async = true;
//     document.head.appendChild(script);

//     script.onload = () => {
//       window.kakao.maps.load(() => {
//         const container = document.getElementById('map');
//         const options = {
//           center: new window.kakao.maps.LatLng(37.5665, 126.9780),
//           level: 3,
//         };
//         const kakaoMap = new window.kakao.maps.Map(container, options);
//         setMap(kakaoMap);
//       });
//     };
//   }, []);

//   return (
//     <div className="relative">
//       <div id="map" style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
//       {places.length > 0 && (
//         <div className="absolute top-0 right-0 w-80 bg-white border rounded-lg shadow-lg p-4 mt-4">
//           <h2 className="text-xl font-semibold mb-2">검색 결과</h2>
//           <ul>
//             {places.map((place) => (
//               <li
//                 key={place.id}
//                 className="border-b py-2 cursor-pointer hover:bg-gray-100"
//                 onClick={() => {
//                   map.setCenter(new window.kakao.maps.LatLng(place.y, place.x));
//                   setSelectedLocation(place);
//                 }}
//               >
//                 <p className="font-semibold">{place.place_name}</p>
//                 <p className="text-gray-600">{place.address_name}</p>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       {selectedLocation && (
//         <div className="mt-4 p-4 border rounded-lg bg-gray-100">
//           <h2 className="text-xl font-semibold">선택한 위치</h2>
//           <p><strong>장소명:</strong> {selectedLocation.place_name}</p>
//           <p><strong>주소:</strong> {selectedLocation.address_name}</p>
//         </div>
//       )}
//     </div>
//   );
// });

// export default KakaoMap;
