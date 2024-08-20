import React, { useState } from 'react';
import jaxios from '../../util/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { getCookie } from "../../util/cookieUtil";
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';

function WriteReview() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]); // 이미지를 담는 배열
    const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기 배열
    const [nextImageIndex, setNextImageIndex] = useState(0); // 다음 이미지 인덱스 관리
    const navigate = useNavigate();

    const userCookie = getCookie('user');
    const userid = userCookie?.userid || null;

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages([...images, file]);
                setImagePreviews([...imagePreviews, reader.result]);
                setNextImageIndex(nextImageIndex + 1);
            };
            reader.readAsDataURL(file);
        }
    };

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

        if (images.length === 0) {
            alert('이미지를 삽입하세요');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        images.forEach((image, index) => {
            formData.append(`reviewimg${index + 1}`, image);
        });
        formData.append('userid', userid);

        jaxios.post('/api/review/writeReview', formData, {
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
        navigate('/reviewList');
    };

    return (
        <>
            <Heading/>
            <h2>여행 후기 쓰기</h2>
            <div className='subPage' style={{paddingTop:'120px'}}>
                <div className="reviewWriteForm" style={{ flex: "4", display: 'flex', flexDirection: 'column' }}>
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
                        <label>사진</label>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            {imagePreviews.map((preview, index) => (
                                <div key={index} style={{ marginBottom: '10px' }}>
                                    <img 
                                        src={preview} 
                                        alt={`미리보기 ${index + 1}`} 
                                        style={{ maxWidth: '200px', maxHeight: '200px' }} // 이미지 크기 증가
                                    />
                                </div>
                            ))}
                            {nextImageIndex < 5 && ( // 이미지가 5개 이하일 때만 파일 선택 창 표시
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageChange} 
                                    style={{ marginTop: '10px' }}
                                />
                            )}
                        </div>
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
