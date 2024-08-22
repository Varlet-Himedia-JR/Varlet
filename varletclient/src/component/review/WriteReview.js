import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../../util/cookieUtil";
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import '../../style/review.css';

function WriteReview() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const navigate = useNavigate();

    const userCookie = getCookie('user');
    const userid = userCookie?.userid || null;

    // 이미지 선택 핸들러
    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + selectedImages.length > 5) {
            alert('최대 5개의 이미지만 업로드할 수 있습니다.');
            return;
        }

        setSelectedImages(prevImages => [...prevImages, ...files]);

        // 이미지 미리보기 생성
        const previews = files.map(file => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previews).then(previewUrls => {
            setImagePreviews(prevPreviews => [...prevPreviews, ...previewUrls]);
        });
    };

    // 이미지 제거 핸들러
    const handleImageRemove = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    // 리뷰 제출 핸들러
    const onSubmit = () => {
        if (!userid) {
            alert('로그인이 필요합니다');
            navigate('/login');
            return;
        }

        if (!title.trim()) {
            alert('제목을 입력하세요');
            return;
        }

        if (!content.trim()) {
            alert('내용을 작성하세요');
            return;
        }

        if (selectedImages.length === 0) {
            alert('이미지를 1개 이상 삽입해 주세요');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('userid', userid);

        selectedImages.forEach((image) => {
            formData.append('reviewimg', image);
        });

        axios.post('/api/review/writeReview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            // 서버에서 응답이 성공적으로 반환되면 페이지 이동
            if (response.status === 200) {
                navigate('/reviewList', { replace: true });
            } else {
                alert('서버 오류: 리뷰 작성에 실패했습니다.');
            }
        })
        .catch((err) => {
            console.error(err);
            alert('서버 오류: 리뷰 작성에 실패했습니다.');
        });
    };

    // 작성 취소 핸들러
    const onCancel = () => {
        navigate('/reviewList'); // 작성 취소 시 reviewList 페이지로 이동
    };

    return (
        <>
            <Heading />
            <h2>여행 후기 쓰기</h2>
            <div className='subPage' style={{ paddingTop: '120px' }}>
                <div className="reviewWriteForm" style={{ flex: "4" }}>
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
                        {imagePreviews.length > 0 && (
                            <div className="image-preview">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="image-preview-item">
                                        <img
                                            src={preview}
                                            alt={`미리보기 ${index + 1}`}
                                            style={{ maxWidth: '100px', maxHeight: '100px', marginRight: '10px' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleImageRemove(index)}
                                            style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="btns">
                        <button onClick={onSubmit}>작성완료</button>
                        <button onClick={onCancel} style={{ marginLeft: '10px' }}>작성 취소</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default WriteReview;
