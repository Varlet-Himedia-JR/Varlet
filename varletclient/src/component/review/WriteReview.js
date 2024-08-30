import React, { useState } from 'react';
import jaxios from '../../util/jwtUtil';
import { useNavigate } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
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
    const handleSubmit = async () => {
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

        try {
            const response = await jaxios.post('/api/review/writeReview', formData);
            if (response.status === 200) {
                alert('리뷰가 성공적으로 작성되었습니다.');
                navigate('/reviewList');
            } else {
                alert('서버 오류: 리뷰 작성에 실패했습니다.');
            }
        } catch (err) {
            console.error(err);
            alert('서버 오류: 리뷰 작성에 실패했습니다.');
        }
    };

    // 작성 취소 핸들러
    const handleCancel = () => {
        if (window.confirm('작성을 취소하시겠습니까?')) {
            navigate('/reviewList');
        }
    };

    return (
        <>
            <Heading />
            <div className="flex justify-center" style={{marginTop:'80px'}}>
                <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-4xl p-6">
                    <h1 className="whitespace-nowrap font-semibold tracking-tight text-4xl mb-6">여행 후기 작성</h1>
                    <div className="grid gap-4 mb-6">
                        <label className="font-medium text-lg" htmlFor="title">
                            제목
                        </label>
                        <input
                            className="border rounded px-2 py-1 w-full"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="제목을 입력하세요"
                        />
                    </div>
                    <div className="grid gap-4 mb-6">
                        <label className="font-medium text-lg" htmlFor="content">
                            내용
                        </label>
                        <textarea
                            className="border rounded px-2 py-1 w-full"
                            id="content"
                            rows="7"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="내용을 입력하세요"
                        ></textarea>
                    </div>
                    <div className="grid gap-4 mb-6">
                        <label className="font-medium text-lg" htmlFor="images">
                            사진 (최대 5개)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            multiple
                            className="border rounded px-2 py-1 w-full"
                        />
                        {imagePreviews.length > 0 && (
                            <div className="image-preview grid gap-4">
                                {imagePreviews.map((preview, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={preview}
                                            alt={`미리보기 ${index + 1}`}
                                            className="w-full h-auto rounded"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleImageRemove(index)}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            onClick={handleCancel}
                        >
                            작성 취소
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handleSubmit}
                        >
                            작성 완료
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default WriteReview;
