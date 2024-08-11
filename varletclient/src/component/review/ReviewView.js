import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getCookie } from '../../util/cookieUtil';

function ReviewView() {
    const [review, setReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', content: '', reviewimg: '' });
    const [replyContent, setReplyContent] = useState('');
    const [replyList, setReplyList] = useState([]);
    const { rseq } = useParams();
    const navigate = useNavigate();
    const loginUser = useSelector(state => state.user);

    useEffect(() => {
        axios.get(`/api/review/getReviewView/${rseq}`)
            .then((result) => {
                setReview(result.data.review);
                setEditForm({
                    title: result.data.review.title,
                    content: result.data.review.content,
                    reviewimg: result.data.review.reviewimg
                });
            })
            .catch((err) => {
                console.error(err);
                setReview({});
            });
    }, [rseq]);

    useEffect(() => {
        if (review) {
            axios.get(`/api/review/getReplies/${rseq}`)
                .then((result) => {
                    setReplyList(result.data.replies);  // 서버 응답에 맞게 수정
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [review, rseq]);

    async function addReply() {
        try {
            const userid = loginUser?.userid;
            const content = replyContent;

            await axios.post('/api/review/addReply', { userid, content, rseq });
            const result = await axios.get(`/api/review/getReplies/${rseq}`);
            setReplyList(result.data.replies);  // 서버 응답에 맞게 수정
        } catch (err) {
            console.error(err);
        }
        setReplyContent('');
    }

    async function deleteReply(renum) {
        try {
            await axios.delete(`/api/review/deleteReply/${renum}`);
            const result = await axios.get(`/api/review/getReplies/${rseq}`);
            setReplyList(result.data.replies);  // 서버 응답에 맞게 수정
        } catch (err) {
            console.error(err);
        }
    }

    function reviewDelete() {
        const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");
        if (isConfirmed) {
            axios.delete(`/api/review/deleteReview/${rseq}`)
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
        axios.post(`/api/review/updateReview/${rseq}`, editForm)
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

    const isUserAuthorized = review && review.userid === getCookie('user')?.userid;
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
                                    <div>{review.userid}</div>
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

                                {review.reviewimg && (
                                    <div className='field'>
                                        <label>Image</label>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="reviewimg"
                                                value={editForm.reviewimg}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            <div>
                                                <img
                                                    src={`http://localhost:8070/images/${review.reviewimg}`}  // Ensure this path is correct
                                                    alt="Review"
                                                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="field">
                                    <label>Replies</label>
                                    <div>
                                        {replyList.length > 0 ? (
                                            <ul>
                                                {replyList.map(reply => (
                                                    <li key={reply.renum}>
                                                        <div>{reply.writer}: {reply.content}</div>
                                                        {loginUser?.userid === reply.writer && (
                                                            <button onClick={() => deleteReply(reply.renum)}>Delete</button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div>No replies yet.</div>
                                        )}
                                    </div>
                                </div>
                                <div className="field">
                                    <label>Add Reply</label>
                                    <textarea
                                        rows="4"
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    />
                                    <button onClick={addReply}>Add Reply</button>
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
