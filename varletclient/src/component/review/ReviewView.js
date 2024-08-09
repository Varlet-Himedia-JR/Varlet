import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';

function ReviewView() {
    const [review, setReview] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', content: '', reviewimg: '' });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(''); // State for image preview
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
                setPreviewImage(result.data.review.reviewimg ? `http://localhost:8070/images/${result.data.review.reviewimg}` : '');
            })
            .catch((err) => {
                console.error(err);
                setReview({});
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
            formData.append('reviewimg', editForm.reviewimg); // Retain existing image if no new file selected
        }
        formData.append('indate', new Date().toISOString()); // Update with the current date

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
            setPreviewImage(URL.createObjectURL(file)); // Preview the selected file
        }
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
