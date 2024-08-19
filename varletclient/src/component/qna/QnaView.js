import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';

function QnaView() {
    const [qna, setQna] = useState({});
    const { qseq } = useParams();
    const navigate = useNavigate();

    useEffect(() => {   
        axios.get(`/api/qna/getQnaView/${qseq}`)
            .then((result) => { setQna(result.data.qna); })
            .catch((err) => { console.error(err); });
    }, [qseq]);

    function qnaDelete() {
        axios.delete(`/api/qna/qnaDelete/${qseq}`)
            .then(() => { navigate('/qna'); })
            .catch((err) => { console.error(err); });
    }

    const currentUserId = getCookie('user')?.userid;
    const isAuthor = qna.userid === currentUserId;

    return (
        <>
        <Heading/>
            <div className='subPage' style={{ paddingTop: '100px' }}>
                <div className="qna" style={{ flex: "4" }}>
                    {
                        (qna) ? (
                            <div className='qnaview'>
                                <h2>QnA View</h2>
                                <div className='field'>
                                    <label>Subject</label>
                                    <div>{qna.subject}</div>
                                </div>
                                <div className='field'>
                                    <label>Writer</label>
                                    <div>{qna.userid}</div>
                                </div>
                                <div className='field'>
                                    <label>Content</label>
                                    <div><pre>{qna.content}</pre></div>
                                </div>
                                <div className='field'>
                                    <label>Reply</label>
                                    <div>{qna.reply}</div>
                                </div>
                            </div>
                        ) : (<div>Loading...</div>)
                    }
                    <div className='btns'>
                        {isAuthor && (
                            <>
                                <button onClick={qnaDelete}>삭제</button>
                                <button onClick={() => navigate('/myQna')}>To My Qna</button>
                            </>
                        )}
                        <button onClick={() => navigate('/qna')}>목록으로</button>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default QnaView;
