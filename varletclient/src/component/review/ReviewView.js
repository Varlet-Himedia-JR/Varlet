import React, { useState, useEffect } from 'react';
import jaxios from '../../util/jwtUtil';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import '../../style/review.css';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';

function ReviewView() {
    const [review, setReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', content: '', reviewimg: [] });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const { rseq } = useParams();
    const navigate = useNavigate();
    const userId = getCookie('user') ? getCookie('user').userid : '';


    useEffect(() => {
        // 리뷰 데이터 로드
        axios.get(`/api/review/getReviewView/${rseq}`)
            .then((result) => {
                const reviewData = result.data.review;
                if (reviewData) {
                    setReview(reviewData);
                    setEditForm({
                        title: reviewData.title,
                        content: reviewData.content,
                        reviewimg: reviewData.reviewimg
                    });
                    if (reviewData.reviewimg.length > 0) {
                        setPreviewImage(`http://localhost:8070${reviewData.reviewimg[0].ipath}`);
                    }
                } else {
                    console.error('Review data is not available.');
                    setReview(null);
                }
            })
            .catch((err) => {
                console.error('Error fetching review:', err);
                setReview(null);
            });

        // 댓글 데이터 로드
        axios.get(`/api/reply/getReplies/${rseq}`)
            .then((result) => {
                setReplies(result.data.replies || []);
            })
            .catch((err) => {
                console.error('Error fetching replies:', err);
                setReplies([]);
            });
    }, [rseq]);

    function reviewDelete() {
        const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
        if (isConfirmed) {
            axios.delete(`/api/review/reviewDelete/${rseq}`)
                .then(() => {
                    navigate('/reviewList');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    function reviewEdit() {
        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('content', editForm.content);

        if (selectedFile) {
            formData.append('reviewimg', selectedFile);
        } else {
            editForm.reviewimg.forEach(img => {
                formData.append('reviewimg', img);
            });
        }

        axios.post(`/api/review/updateReview/${rseq}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                setIsEditing(false);
                // 리뷰 업데이트 후 댓글 데이터 다시 로드
                jaxios.get(`/api/review/getReviewView/${rseq}`)
                    .then((result) => {
                        setReview(result.data.review);
                        setEditForm({
                            title: result.data.review.title,
                            content: result.data.review.content,
                            reviewimg: result.data.review.reviewimg
                        });
                        if (result.data.review.reviewimg.length > 0) {
                            setPreviewImage(`http://localhost:8070${result.data.review.reviewimg[0].ipath}`);
                        }

                        // 댓글 데이터 다시 로드
                        jaxios.get(`/api/reply/getReplies/${rseq}`)
                            .then((result) => {
                                setReplies(result.data.replies || []);
                            })
                            .catch((err) => {
                                console.error(err);
                                setReplies([]);
                            });
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            })
            .catch((err) => {
                console.error(err);
            });
    }

    function handleInputChange(event) {
        const { name, value } = event.target;
        setEditForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    }

    function handleFileChange(event) {
        const file = event.target.files[0];
        setSelectedFile(file);
        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    function handleImageRemove() {
        setSelectedFile(null);
        setPreviewImage('');
    }

    function handleNewReplyChange(event) {
        setNewReply(event.target.value);
    }

    function handleNewReplySubmit() {
        if (newReply.trim()) {
            const reply = {
                rseq: review.rseq,
                userid: userId,
                content: newReply
            };
            jaxios.post(`/api/reply/addReply`, reply)
                .then((result) => {
                    setReplies(prevReplies => [...prevReplies, result.data.reply]);
                    setNewReply('');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    function handleReplyDelete(replyId, replyUserId) {
        if (replyUserId !== userId) {
            alert("댓글 작성자만 삭제할 수 있습니다.");
            return;
        }

        const isConfirmed = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
        if (isConfirmed) {
            jaxios.delete(`/api/reply/deleteReply/${replyId}`, {
                data: { userId }
            })
                .then(() => {
                    setReplies(prevReplies => prevReplies.filter(reply => reply.renum !== replyId));
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }

    function handleBackToList() {
        navigate('/myReview');
    }

    const isUserAuthorized = review && review.userid === userId;
    const formattedDate = review?.indate ? new Date(review.indate).toLocaleDateString() : '';

    return (
        <>
            <Heading />
            <div className='background'><img alt=''src="http://localhost:8070/images/oceans.jpg"/></div>
                    {
                        review ? (
                            <div className='reviewview' style={{flex:4}}>
                                <h2>Review View</h2>
                                <div className='field'>
                                    <label>번호</label>
                                    <div>{review.rseq}</div>
                                </div>
                                <div className='field'>
                                    <label>제목</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="title"
                                            value={editForm.title}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div>{review.title}</div>
                                    )}
                                </div>
                                <div className='field'>
                                    <label>작성자</label>
                                    <div>{review.userid || 'Unknown'}</div>
                                </div>
                                <div className='field'>
                                    <label>내용</label>
                                    {isEditing ? (
                                        <textarea
                                            name="content"
                                            value={editForm.content}
                                            onChange={handleInputChange}
                                        />
                                    ) : (
                                        <div><pre>{review.content}</pre></div>
                                    )}
                                </div>
                                <div className='field'>
                                    <label>날짜</label>
                                    <div>{formattedDate}</div>
                                </div>
                                <div className='field'>
                                    <label>조회수</label>
                                    <div>{review.readcount}</div>
                                </div>

                                <div className='field'>
                                    <label>이미지</label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            {previewImage && (
                                                <div className="image-preview">
                                                    <img
                                                        src={previewImage}
                                                        alt="Preview"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleImageRemove}
                                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '24px' }}
                                                    >
                                                        &times; {/* 'X' 문자 */}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        review.reviewimg && review.reviewimg.length > 0 && (
                                            <div>
                                                {review.reviewimg.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={`http://localhost:8070${img.ipath}`}
                                                        alt={`Review ${index}`}
                                                
                                                    />
                                                ))}
                                            </div>
                                        )
                                    )}
                                </div>

                                {!isEditing && (
                                    <div className='replies'>
                                        <h3>댓글</h3>
                                        <div>
                                            {replies.length > 0 ? (
                                                replies.map(reply => (
                                                    <div key={reply.renum} className='reply'>
                                                        <div><strong>{reply.userid || 'Unknown'}</strong></div>
                                                        <div>{reply.content}</div>
                                                        <div>{reply.writedate ? new Date(reply.writedate).toLocaleString() : 'Unknown date'}</div>
                                                        {reply.userid === userId && (
                                                            <button onClick={() => handleReplyDelete(reply.renum, reply.userid)}>삭제</button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (null)}
                                        </div>
                                        <div className='new-reply'>
                                            <textarea
                                                value={newReply}
                                                onChange={handleNewReplyChange}
                                                placeholder="댓글을 입력하세요"
                                            />
                                            <button onClick={handleNewReplySubmit}>댓글 작성</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )
                    }
                    <div className='btn'>
                        {
                            isUserAuthorized ? (
                                <>
                                    {isEditing ? (
                                        <>
                                            <button onClick={reviewEdit}>저장</button>
                                            <button onClick={() => setIsEditing(false)}>취소</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={reviewDelete}>삭제</button>
                                            <button onClick={() => setIsEditing(true)}>편집</button>
                                        </>
                                    )}
                                    <button onClick={handleBackToList}>나의 후기</button>
                                </>
                            ) : null
                        }
                        <button onClick={() => { navigate('/reviewList') }}>전체</button>
                    </div>

            <Footer />
        </>
    );
}

export default ReviewView;
