import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';

function ReviewView() {
    const [review, setReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);  // Editing state
    const [editForm, setEditForm] = useState({ title: '', content: '', reviewimg: '' });
    const { rseq } = useParams();
    const navigate = useNavigate();

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

    function reviewDelete() {
        // 사용자에게 삭제 확인 대화상자를 표시
        const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");

        if (isConfirmed) {
            axios.delete(`/api/review/reviewDelete/${rseq}`)
                .then(() => {
                    // 삭제가 성공하면 리뷰 목록 페이지로 이동
                    navigate('/reviewList');
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            // 사용자가 취소를 클릭한 경우 아무 동작도 하지 않음
            console.log("삭제가 취소되었습니다.");
        }
    }

    function reviewEdit() {
        axios.post(`/api/review/updateReview/${rseq}`, {
            ...editForm,
            indate: new Date() // Update the date to the current date
        })
            .then(() => {
                setIsEditing(false);
                // Fetch the updated review after edit
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

    // Format the date if `indate` exists
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
                                                    src={`/images/${review.reviewimg}`}  // Adjust path as needed
                                                    alt="Review"
                                                    style={{ maxWidth: '300px', maxHeight: '300px' }}
                                                />
                                            </div>
                                        )}
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
