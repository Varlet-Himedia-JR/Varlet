import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import { getCookie } from "../../util/cookieUtil";
import '../../style/review.css';

function WriteReview() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);
    
    // 쿠키에서 사용자 ID를 가져오되, 존재하지 않으면 기본값 설정
    const userCookie = getCookie('user');
    const userid = userCookie?.userid || 'guest'; // 기본값 설정

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedImage(null);
            setImagePreview('');
        }
    };

    const onSubmit = () => {
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
        if (selectedImage) {
            formData.append('reviewimg', selectedImage); // 파일 객체
        }
        formData.append('userid', userid); // 동적으로 가져온 사용자 ID 설정

        axios.post('/api/review/writeReview', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(() => { 
            navigate('/reviewList'); 
        })
        .catch((err) => {
            console.error('Error while submitting review:', err);
            alert('리뷰 제출 중 오류가 발생했습니다. 콘솔을 확인하세요.');
        });
    };

    const onCancel = () => {
        navigate('/reviewList'); // 작성 취소 시 reviewList 페이지로 이동
    };

    return (
        <article>
            <Heading />
            <h2>Write Review</h2>
            <div className='subPage'>
                <div className="reviewWriteForm" style={{ flex: "4" }}>
                    <div className="field">
                        <label>Title</label>
                        <input 
                            type="text" 
                            value={title} 
                            onChange={(e) => setTitle(e.currentTarget.value)} 
                        />
                    </div>
                    <div className="field">
                        <label>Content</label>
                        <textarea 
                            rows="7" 
                            value={content} 
                            onChange={(e) => setContent(e.currentTarget.value)} 
                        ></textarea>
                    </div>
                    <div className="field">
                        <label>Image</label>
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleImageChange} 
                        />
                        {imagePreview && (
                            <div className="image-preview">
                                <img src={imagePreview} alt="Preview" style={{ maxWidth: '100px', maxHeight: '100px' }} />
                            </div>
                        )}
                    </div>
                    <div className="btns">
                        <button onClick={onSubmit}>Submit</button>
                        <button onClick={onCancel} style={{ marginLeft: '10px' }}>Cancel</button>
                    </div>
                </div>
            </div>
            <Footer />
        </article>
    );
}

export default WriteReview;
