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
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const { rseq } = useParams();
    const navigate = useNavigate();
    const userId = getCookie('user').userid;

    useEffect(() => {
        jaxios.get(`/api/review/getReviewView/${rseq}`)
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
                        setPreviewImages(reviewData.reviewimg.map(img => `http://localhost:8070${img.ipath}`));
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

        jaxios.get(`/api/reply/getReplies/${rseq}`)
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

        selectedFiles.forEach(file => {
            formData.append('reviewimg', file);
        });

        axios.post(`/api/review/updateReview/${rseq}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                setIsEditing(false);
                jaxios.get(`/api/review/getReviewView/${rseq}`)
                    .then((result) => {
                        setReview(result.data.review);
                        setEditForm({
                            title: result.data.review.title,
                            content: result.data.review.content,
                            reviewimg: result.data.review.reviewimg
                        });
                        if (result.data.review.reviewimg.length > 0) {
                            setPreviewImages(result.data.review.reviewimg.map(img => `http://localhost:8070${img.ipath}`));
                        }
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
        const files = Array.from(event.target.files);
        setSelectedFiles(prevFiles => [...prevFiles, ...files]);
        setPreviewImages(prevImages => [...prevImages, ...files.map(file => URL.createObjectURL(file))]);
    }

    function handleImageRemove(index) {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
        setPreviewImages(prevImages => prevImages.filter((_, i) => i !== index));
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
            <div className='subPage' style={{ paddingTop: '100px' }}>
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
                                    <label>Image</label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="file"
                                                multiple
                                                onChange={handleFileChange}
                                            />
                                            {previewImages.map((image, index) => (
                                                <div className="image-preview" key={index}>
                                                    <img
                                                        src={image}
                                                        alt={`Preview ${index}`}
                                                        style={{ maxWidth: '300px', maxHeight: '300px', marginRight: '10px' }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleImageRemove(index)}
                                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '24px' }}
                                                    >
                                                        &times; {/* 'X' 문자 */}
                                                    </button>
                                                </div>
                                            ))}
                                        </>
                                    ) : (
                                        review.reviewimg && review.reviewimg.length > 0 && (
                                            <div>
                                                {review.reviewimg.map((img, index) => (
                                                    <img
                                                        key={index}
                                                        src={`http://localhost:8070${img.ipath}`}
                                                        alt={`Review ${index}`}
                                                        style={{ maxWidth: '300px', maxHeight: '300px', marginRight: '10px' }}
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
                            </div>
                        ) : (
                            <div>Loading...</div>
                        )
                    }
                    <div className='btns'>
                        {
                            isUserAuthorized ? (
                                <>
                                    {isEditing ? (
                                        <>
                                            <button onClick={reviewEdit}>Save</button>
                                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button onClick={reviewDelete}>Delete</button>
                                            <button onClick={() => setIsEditing(true)}>Edit</button>
                                        </>
                                    )}
                                    <button onClick={handleBackToList}>To My List</button>
                                </>
                            ) : null
                        }
                        <button onClick={() => { navigate('/reviewList') }}>Back to List</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default ReviewView;
