import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { getCookie } from '../../util/cookieUtil';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/qnaview.css';

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
        alert('정말로 삭제하시겠습니까?');
        axios.delete(`/api/qna/qnaDelete/${qseq}`)
            .then(() => { navigate('/qna'); })
            .catch((err) => { console.error(err); });
    }

    const currentUserId = getCookie('user')?.userid;
    const isAuthor = qna.userid === currentUserId;

    return (
        <>
        <Heading/>
            <div className='qnaviewPage' style={{ paddingTop: '80px' }}>
                <div className="qna" style={{ flex: "4" }}>
                    {
                        (qna) ? (
                            <div className='qnaview'>
                                <h2>문의사항</h2>
                                <div className='qnaview_field'>
                                    <label>제목</label>
                                    <div>{qna.subject}</div>
                                </div>
                                <div className='qnaview_field'>
                                    <label>작성자</label>
                                    <div>{qna.userid}</div>
                                </div>
                                <div className='qnaview_field'>
                                    <label>내용</label>
                                    <div><pre>{qna.content}</pre></div>
                                </div>
                                <div className='qnaview_field'>
                                    <label>답변</label>
                                    <div>{qna.reply}</div>
                                </div>
                            </div>
                        ) : (<div>Loading...</div>)
                    }
                    <div className='qnaview_btns'>
                        {isAuthor && (
                            <>
                                <button onClick={qnaDelete}>삭제</button>
                                <button onClick={() => navigate('/myQna')}>내 QNA</button>
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
