import React, { useState,useEffect } from 'react'

import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";

function QnaView() {
    const [qna,setQna] = useState({});
    const {qseq} = useParams();
    const navigate = useNavigate();

    useEffect(
        ()=>{   
            axios.get(`/api/qna/getQnaView/${qseq}`)
            .then((result)=>{ setQna(result.data.qna)})
            .catch((err)=>{console.error(err)})
        },[]
    )

    function qnaDelete(){
            axios.delete(`/api/qna/qnaDelete/${qseq}`)
            .then(()=>{ navigate('/qna')})
            .catch((err)=>{console.error(err)})
    }

  return (
    <>
            <div className='subPage' style={{paddingTop:'100px'}}>
                <div className="qna" style={{flex:"4"}}>
                {
                        (qna)?(
                            <div className='qnaview'>
                                <h2>QnA View</h2>
                                <div className='field'>
                                    <label>Subject</label>
                                    <div>{qna.subject}</div>
                                </div>
                                <div className='field'>
                                    <label>writer</label>
                                    <div>{qna.userid}</div>
                                </div>
                                <div className='field'>
                                    <label>content</label>
                                    <div><pre>{qna.content}</pre></div>
                                </div>
                                <div className='field'>
                                    <label>Reply</label>
                                    <div>{qna.reply}</div>
                                </div>
                            </div>
                        ):(<div>Loading</div>)
                    }
                    <div className='btns'>
                        {
                        (qna.userid == getCookie('user').userid)?(
                            <button onClick={qnaDelete}>삭제</button>
                        ):(<></>)
                        }
                        <button onClick={()=>{navigate('/qna')}}>목록으로</button>
                        </div>
                </div>
            </div>
    </>
  )
}

export default QnaView