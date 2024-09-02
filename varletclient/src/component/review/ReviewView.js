import React, { useState, useEffect } from 'react';
import jaxios from '../../util/jwtUtil';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import Heading from '../headerfooter/Heading';
import Footer from '../headerfooter/Footer';
import Slider from "react-slick"; // 슬라이더 추가
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,           // 자동 재생 활성화
        autoplaySpeed: 2000,      // 2초마다 슬라이드 변경 (2000ms)
    };

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
                // 리뷰 업데이트 후 데이터 다시 로드
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

            <div className="subPage" style={{ backgroundColor: 'white', width: '80%', paddingTop: '100px', opacity: '0.9' }}>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-1 py-8">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    {review?.reviewimg && review.reviewimg.length > 0 && (
                                        <Slider {...settings}>
                                            {review.reviewimg.map((img, index) => (
                                                <div key={index}>
                                                    <img
                                                        className="contents-img"
                                                        src={`http://localhost:8070${img.ipath}`}
                                                        alt={`Review ${index}`}
                                                    />
                                                </div>
                                            ))}
                                        </Slider>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                name="title"
                                                value={editForm.title}
                                                onChange={handleInputChange}
                                                className="border p-2 w-full"
                                            />
                                        ) : (
                                            review?.title
                                        )}
                                    </h1>
                                    <div className="mt-4">
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full caption-bottom text-sm">
                                                <tbody className="[&_tr:last-child]:border-0">
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle">번호</td>
                                                        <td className="p-4 align-middle">{review?.rseq}</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle">작성자</td>
                                                        <td className="p-4 align-middle">{review?.userid || 'Unknown'}</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle">내용</td>
                                                        <td className="p-4 align-middle">
                                                            {isEditing ? (
                                                                <textarea
                                                                    name="content"
                                                                    value={editForm.content}
                                                                    onChange={handleInputChange}
                                                                    className="border p-2 w-full"
                                                                />
                                                            ) : (
                                                                <pre>{review?.content}</pre>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle">날짜</td>
                                                        <td className="p-4 align-middle">{formattedDate}</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle">조회수</td>
                                                        <td className="p-4 align-middle">{review?.readcount}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-6 flex gap-2">
                                            {getCookie('user') ? (
                                                <div onClick={handleNewReplySubmit}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32">
                                                    <span className="text-xl font-bold">댓글 작성</span>
                                                </div>
                                            ) : null}

                                            {getCookie('user') && <div onClick={handleBackToList}
                                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32">
                                                <span className="text-xl font-bold">나의 후기</span>
                                            </div>}

                                            <div onClick={() => { navigate('/reviewList') }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32">
                                                <span className="text-xl font-bold">목록으로</span>
                                            </div>
                                        </div>

                                        {isUserAuthorized && (
                                            <div className="mt-6 flex gap-2">
                                                {isEditing ? (
                                                    <>
                                                        <button onClick={reviewEdit}
                                                            className="bg-black text-white px-4 py-2 rounded w-32">
                                                            저장
                                                        </button>
                                                        <button onClick={() => setIsEditing(false)}
                                                            className="bg-black text-white px-4 py-2 rounded w-32">
                                                            취소
                                                        </button>
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={reviewDelete}
                                                            className="bg-black text-white px-4 py-2 rounded w-32">
                                                            삭제
                                                        </button>
                                                        <button onClick={() => setIsEditing(true)}
                                                            className="bg-black text-white px-4 py-2 rounded w-32">
                                                            편집
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {!isEditing && (
                                <div className="mt-8">
                                    <h3 className="text-2xl font-bold">댓글</h3>
                                    <div className="mt-4">
                                        {replies.length > 0 ? (
                                            replies.map(reply => (
                                                <div key={reply.renum} className="border-b p-2">
                                                    <div><strong>{reply.userid || 'Unknown'}</strong></div>
                                                    <div>{reply.content}</div>
                                                    <div>{reply.writedate ? new Date(reply.writedate).toLocaleString() : 'Unknown date'}</div>
                                                    {reply.userid === userId && (
                                                        <button onClick={() => handleReplyDelete(reply.renum, reply.userid)}
                                                            className="text-red-500">삭제</button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div>댓글이 없습니다.</div>
                                        )}
                                    </div>
                                    <div className="mt-4">
                                        <textarea
                                            value={newReply}
                                            onChange={handleNewReplyChange}
                                            placeholder="댓글을 입력하세요"
                                            className="border p-2 w-full"
                                        />
                                        <button onClick={handleNewReplySubmit}
                                            className="bg-blue-500 text-white px-4 py-2 rounded w-full mt-2">댓글 작성</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default ReviewView;
