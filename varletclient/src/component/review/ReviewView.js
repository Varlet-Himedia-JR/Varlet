import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import '../../style/review.css';

function ReviewView() {
    const [review, setReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', content: '', reviewimg: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const { rseq } = useParams();
    const navigate = useNavigate();

    const userId = getCookie('user')?.userid || 'guest'; // 로그인된 사용자 ID 또는 guest

    useEffect(() => {
        // 리뷰 데이터 로드
        axios.get(`/api/review/getReviewView/${rseq}`)
            .then((result) => {
                setReview(result.data.review);
                setEditForm({
                    title: result.data.review.title,
                    content: result.data.review.content,
                    reviewimg: result.data.review.reviewimg
                });
                setPreviewImage(result.data.review.reviewimg ? `http://localhost:8070/images/${result.data.review.reviewimg}` : '');
            })
            .catch((err) => {
                console.error(err);
                setReview({});
            });

        // 댓글 데이터 로드
        axios.get(`/api/reply/getReplies/${rseq}`)
            .then((result) => {
                setReplies(result.data.replies || []);
            })
            .catch((err) => {
                console.error(err);
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
        } else {
            console.log("삭제가 취소되었습니다.");
        }
    }

    function reviewEdit() {
        const formData = new FormData();
        formData.append('title', editForm.title);
        formData.append('content', editForm.content);

        if (selectedFile) {
            formData.append('reviewimg', selectedFile);
        } else {
            formData.append('reviewimg', editForm.reviewimg);
        }

        formData.append('indate', new Date().toISOString());

        axios.post(`/api/review/updateReview/${rseq}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
            .then(() => {
                setIsEditing(false);
                axios.get(`/api/review/getReviewView/${rseq}`)
                    .then((result) => {
                        setReview(result.data.review);
                        setEditForm({
                            title: result.data.review.title,
                            content: result.data.review.content,
                            reviewimg: result.data.review.reviewimg
                        });
                        setPreviewImage(result.data.review.reviewimg ? `http://localhost:8070/images/${result.data.review.reviewimg}` : '');
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

    function handleNewReplyChange(event) {
        setNewReply(event.target.value);
    }

    function handleNewReplySubmit() {
        if (newReply.trim()) {
            const reply = {
                rseq: review.rseq,
                userid: userId, // 로그인이 되어 있으면 사용자 ID, 아니면 guest
                content: newReply
            };
            axios.post(`/api/reply/addReply`, reply)
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
        // 현재 로그인한 사용자와 댓글 작성자가 같은지 확인
        if (replyUserId !== userId) {
            alert("댓글 작성자만 삭제할 수 있습니다.");
            return;
        }

        const isConfirmed = window.confirm("정말로 이 댓글을 삭제하시겠습니까?");
        if (isConfirmed) {
            axios.delete(`/api/reply/deleteReply/${replyId}`, {
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
        navigate('/myReview'); // MyReview 페이지로 돌아감
    }

    const isUserAuthorized = review && review.userid === userId;
    const formattedDate = review?.indate ? new Date(review.indate).toLocaleDateString() : '';

    return (
        <article>
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
                                    <label>Image</label>
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="file"
                                                onChange={handleFileChange}
                                            />
                                            {previewImage && (
                                                <img
                                                    src={previewImage}
                                                    alt="Preview"
                                                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        review.reviewimg && (
                                            <div>
                                                <img
                                                    src={`http://localhost:8070/images/${review.reviewimg}`}
                                                    alt="Review"
                                                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>

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
                                    <button onClick={handleBackToList}>To My Review</button>
                                </>
                            ) : null
                        }
                        <button onClick={() => { navigate('/reviewList') }}>Back to List</button>
                    </div>
                </div>
            </div>
        </article>
    );
}

export default ReviewView;
