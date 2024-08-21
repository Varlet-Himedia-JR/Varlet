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

    // 쿠키에서 사용자 ID를 가져옴
    const userCookie = getCookie('user');
    const userid = userCookie?.userid || null;

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        if (files.length + selectedImages.length > 5) {
            alert('최대 5개의 이미지만 업로드할 수 있습니다.');
            return;
        }

        setSelectedImages(prevImages => [...prevImages, ...files]);

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

    const handleImageRemove = (index) => {
        setSelectedImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    };

    const onSubmit = () => {
        if (!userid) {
            alert('로그인이 필요합니다');
            navigate('/login'); // 로그인 페이지로 이동
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
    
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        selectedImages.forEach((image) => {
            formData.append('reviewimg', image); // 리뷰 이미지로 추가
        });
        formData.append('userid', userid); // 동적으로 가져온 사용자 ID 설정
    
        axios.post('/api/review/writeReview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => { navigate('/reviewList'); })
        .catch((err) => {
            console.error(err);
        });
    };
    
    const onCancel = () => {
        navigate('/reviewList'); // 작성 취소 시 reviewList 페이지로 이동
    };

    return (
        <>
            <Heading/>
            <h2>여행 후기 쓰기</h2>
            <div className='subPage' style={{paddingTop:'120px'}}>
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
                            multiple // 여러 파일 선택 허용
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
                                            &times; {/* 'X' 문자 */}
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
            <Footer/>
        </>
    );
}

export default WriteReview;
