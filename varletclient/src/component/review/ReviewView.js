import React, { useState, useEffect } from 'react';
import jaxios from '../../util/jwtUtil';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/review.css';

function ReviewView() {
    const [review, setReview] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', content: '', reviewimgs: [] });
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const { rseq } = useParams();
    const navigate = useNavigate();

    const userId = getCookie('user').userid; // 로그인된 사용자 ID

    useEffect(() => {
        // 리뷰 데이터 로드
        jaxios.get(`/api/review/getReviewView/${rseq}`)
            .then((result) => {
                const reviewData = result.data.review;
                setReview(reviewData);
                console.log(reviewData);
                console.log(review);
                setEditForm({
                    title: reviewData.title,
                    content: reviewData.content,
                    reviewimgs: reviewData.reviewimgs || [] // Ensure it's an array
                });
                // 이미지 URL 설정
                const reviewImgs = reviewData.reviewimgs || [];
                setPreviewImages(reviewImgs.map(img => `http://localhost:8070/images/${img}`));
            })
            .catch((err) => {
                console.error(err);
                setReview({});
            });

        // 댓글 데이터 로드
        jaxios.get(`/api/reply/getReplies/${rseq}`)
            .then((result) => {
                setReplies(result.data.replies || []);
            })
            .catch((err) => {
                console.error(err);
                setReplies([]);
            });
    }, [rseq]);

    function reviewDelete() {
        if (!userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
        if (isConfirmed) {
            jaxios.delete(`/api/review/reviewDelete/${rseq}`)
                .then(() => {
                    navigate('/reviewList');
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            console.log("삭제가 취소되었습니다.");
        }
    }

    function reviewEdit() {
        if (!userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('content', editForm.content);

        selectedFiles.forEach((file, index) => {
            formData.append(`reviewimg${index + 1}`, file);
        });

        formData.append('indate', new Date().toISOString());

        jaxios.post(`/api/review/updateReview/${rseq}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                setIsEditing(false);
                jaxios.get(`/api/review/getReviewView/${rseq}`)
                    .then((result) => {
                        const reviewData = result.data.review;
                        setReview(reviewData);
                        setEditForm({
                            title: reviewData.title,
                            content: reviewData.content,
                            reviewimgs: reviewData.reviewimgs || [] // Ensure it's an array
                        });
                        const reviewImgs = reviewData.reviewimgs || [];
                        setPreviewImages(reviewImgs.map(img => `http://localhost:8070/images/${img}`));
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
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            const newFiles = [...selectedFiles, ...files].slice(0, 5); // Limit to 5 files
            setSelectedFiles(newFiles);
            setPreviewImages(newFiles.map(file => URL.createObjectURL(file)));
        }
    }

    function handleNewReplyChange(event) {
        setNewReply(event.target.value);
    }

    function handleNewReplySubmit() {
        if (!userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        if (newReply.trim()) {
            const reply = {
                rseq: review.rseq,
                userid: userId, // 로그인된 사용자 ID
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

    function handleReplyDelete(replyId) {
        if (!userId) {
            alert('로그인이 필요합니다.');
            navigate('/login');
            return;
        }

        const reply = replies.find(reply => reply.renum === replyId);
        if (reply.userid !== userId) {
            alert("댓글 작성자만 삭제할 수 있습니다.");
            return;
        }

        const isConfirmed = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
        if (isConfirmed) {
            jaxios.delete(`/api/reply/deleteReply/${replyId}`, {
                data: { userId } // 사용자 ID를 요청 본문에 포함
            })
                .then(() => {
                    setReplies(prevReplies => prevReplies.filter(reply => reply.renum !== replyId));
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            console.log("댓글 삭제가 취소되었습니다.");
        }
    }

    function handleBackToList() {
        navigate('/reviewList'); // reviewList 페이지로 돌아감
    }

    function handleonToList() {
        navigate('/myReview'); // MyReview 페이지로 돌아감
    }

    const isUserAuthorized = review && review.userid === userId;
    const formattedDate = review?.indate ? new Date(review.indate).toLocaleDateString() : '';

    return (
        <>
         <Heading/>
            <div className='subPage'>
                <div className="review" style={{ flex: "4" }}>
                    {
                        review ? (
                            <div className='reviewview'>
                                <h2>Review View</h2>
                                <div className='field'>
                                    <label>Number</label>
                                    <div>{review.rseq}</div>
                                </div>
                                <div className='field'>
                                    <label>Title</label>
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
                                    <label>Writer</label>
                                    <div>{review.userid || 'Unknown'}</div>
                                </div>
                                <div className='field'>
                                    <label>Content</label>
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
                                    <label>Date</label>
                                    <div>{formattedDate}</div>
                                </div>
                                <div className='field'>
                                    <label>Readcount</label>
                                    <div>{review.readcount}</div>
                                </div>

                                <div className='field'>
                                    <label>Images</label>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                            />
                                            {previewImages.length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '10px' }}>
                                                    {previewImages.map((img, index) => (
                                                        <img
                                                            key={index}
                                                            src={img}
                                                            alt={`Preview ${index + 1}`}
                                                            style={{ maxWidth: '200px', maxHeight: '200px', margin: '5px' }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        (review.reviewimgs && review.reviewimgs.length > 0) ? (
                                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {review.reviewimgs.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={`http://localhost:8070/images/${img}`}
                                                        alt={`Review ${index + 1}`}
                                                        style={{ maxWidth: '200px', maxHeight: '200px', margin: '5px' }}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div>No image available</div>
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
                                                            <button onClick={() => handleReplyDelete(reply.renum)}>삭제</button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div>댓글이 없습니다.</div>
                                            )}
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

                                <div className='buttons'>
                                    <button onClick={handleBackToList}>목록으로</button>
                                    {isUserAuthorized && (
                                        <>
                                            {!isEditing ? (
                                                <>
                                                    <button onClick={() => setIsEditing(true)}>수정</button>
                                                    <button onClick={reviewDelete}>삭제</button>
                                                    <button onClick={handleonToList}>내 리뷰</button>
                                                </>
                                            ) : (
                                                <button onClick={reviewEdit}>저장</button>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div>리뷰를 불러올 수 없습니다.</div>
                        )
                    }
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default ReviewView;