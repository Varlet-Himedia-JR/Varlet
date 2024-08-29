import React, { useState } from 'react';
import jaxios from '../../util/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../../util/cookieUtil";
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import '../../style/review.css';

function WriteReview() {
    const [title, setTitle] = useState(''); // 제목 상태 관리
    const [content, setContent] = useState(''); // 내용 상태 관리
    const [selectedImages, setSelectedImages] = useState([]); // 선택한 이미지 파일들 상태 관리
    const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기 URL 상태 관리
    const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅 사용

    const userCookie = getCookie('user'); // 쿠키에서 사용자 정보를 가져옴
    const userid = userCookie?.userid || null; // 쿠키에서 userid를 가져옴, 없으면 null

    // 이미지 선택 핸들러
    const handleImageChange = (event) => {

        const files = Array.from(event.target.files);
        console.log("파일 확인", files);
        if (files.length + selectedImages.length > 5) {
            alert('최대 5개의 이미지만 업로드할 수 있습니다.');
            return;
        }

        setSelectedImages(prevImages => [...prevImages, ...files]); // 선택한 이미지를 상태에 추가

        // 이미지 미리보기 생성
        const previews = files.map(file => {
            const reader = new FileReader(); // FileReader를 사용하여 이미지 파일을 읽음
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result); // 읽기가 완료되면 resolve로 미리보기 URL 반환
                reader.readAsDataURL(file); // 이미지를 Data URL로 변환
            });
        });

        // 모든 이미지 파일의 미리보기를 생성한 후 상태에 저장
        Promise.all(previews).then(previewUrls => {
            setImagePreviews(prevPreviews => [...prevPreviews, ...previewUrls]);
        });
    };

    // 이미지 제거 핸들러
    const handleImageRemove = (index) => {
        // 선택한 이미지와 미리보기에서 해당 인덱스의 이미지를 제거
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    // 리뷰 제출 핸들러
    const onSubmit = () => {
        if (!userid) { // 로그인이 안 되어 있을 경우 경고 후 로그인 페이지로 이동
            alert('로그인이 필요합니다');
            navigate('/login');
            return;
        }

        if (!title.trim()) { // 제목이 비어 있을 경우 경고
            alert('제목을 입력하세요');
            return;
        }

        if (!content.trim()) { // 내용이 비어 있을 경우 경고
            alert('내용을 작성하세요');
            return;
        }

        if (selectedImages.length === 0) { // 이미지가 없을 경우 경고
             alert('이미지를 1개 이상 삽입해 주세요');
             return;
        }

        const formData = new FormData(); // FormData 객체 생성
        formData.append('title', title); // 제목 추가
        formData.append('content', content); // 내용 추가
        formData.append('userid', userid); // 사용자 ID 추가


        // 선택한 이미지를 FormData에 추가

        


        selectedImages.forEach((image) => {
            formData.append('reviewimg', image);
        });


        // jaxios를 사용하여 서버로 리뷰 데이터를 POST 요청

        jaxios.post('/api/review/writeReview', formData)
        .then(response => {
            // 서버에서 응답이 성공적으로 반환되면 페이지 이동
            if (response.status === 200) {
                // 페이지 새로 고침 후 리뷰 목록으로 이동
                window.location.href = '/reviewList';
                console.log(response.data);
            } else {
                alert('서버 오류: 리뷰 작성에 실패했습니다.'); // 서버 오류 경고
            }
        })
        .catch((err) => {
            console.error(err);
            alert('서버 오류: 리뷰 작성에 실패했습니다.'); // 서버 오류 경고
        });
    };

    // 작성 취소 핸들러
    const onCancel = () => {
        navigate('/reviewList'); // 작성 취소 시 리뷰 목록 페이지로 이동
    };

    return (
        <>
            <Heading />
            <div >
            <div className='background'><img alt=''src="http://localhost:8070/images/oceans.jpg"/></div>
            </div>
            
                <div className="reviewWriteForm">
                <h2>WRITE FORM</h2>
                    <div className="field">
                        <label>제목</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.currentTarget.value)} 
                        />
                    </div>
                    <div className="field">
                        <label>내용</label>
                        <textarea 
                            rows="7" 
                            value={content} 
                            onChange={(e) => setContent(e.currentTarget.value)} 
                        ></textarea>
                    </div>
                    <div className="field">
                        <label>사진 (최대 5개)</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                            multiple
                        />
                        {imagePreviews.length > 0 && ( // 이미지 미리보기가 있을 경우에만 표시
                            <div className="image-preview">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index}>
                                        <img
                                            src={preview}
                                            alt={`미리보기 ${index + 1}`}
                                            
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleImageRemove(index)}
                                        
                                        >
                                            &times; {/* 이미지 제거 버튼 */}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="btn">
                        <button onClick={onSubmit}>작성완료</button> {/* 리뷰 작성 버튼 */}
                        <button onClick={onCancel} style={{ marginLeft: '10px' }}>작성 취소</button> {/* 작성 취소 버튼 */}
                    </div>
                </div>
            <Footer />
        </>
    );
}

export default WriteReview;
