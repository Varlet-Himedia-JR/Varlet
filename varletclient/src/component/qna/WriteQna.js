import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';

function WriteQna() {
    const [subject, setSubject] = useState('');
    const [content, setContent] = useState('');
    const [pass,setPass] = useState('');
    const [security, setSecurity] = useState('');
    const loginUser = useSelector(state => state.user);
    const navigate = useNavigate();

    function onSubmit(){
        setSecurity('Y')
        axios.post('/api/qna/writeQna',{subject,content, userid:loginUser.userid, security,pass})
        .then(()=>{ navigate('/qna')})
        .catch((err)=>{
            console.error(err);
        })
    }


  return (
    <article>
        <Heading/>
            <div className='subPage'>
                <div className="qnawriteform" style={{flex:"4"}}>
                    <h2>1:1 문의하기</h2>
                    <div className="field">
                        <label>제목</label>
                        <input type="text" value={subject} onChange={
                            (e)=>{ setSubject(e.currentTarget.value) }
                        }/>
                    </div>
                    <div className="field">
                        <label>비밀번호</label>
                        <div style={{lineHeight:"30px"}} >
                            <input type="password" value={pass} id="pass" onChange={
                                (e)=>{setPass(e.currentTarget.value)}
                            } />
                        </div>
                    </div>
                    <div className="field">
                        <label>내용</label>
                        <textarea rows="7" value={content} onChange={
                            (e)=>{ setContent(e.currentTarget.value) }
                        }></textarea>
                    </div>
        
                    <div className='btns'>
                        <button onClick={  ()=>{ onSubmit() }  }>문의하기</button>
                        <button onClick={ ()=>{ navigate('/qna')} }>목록으로</button>
                    </div>
                </div>
            </div>
        <Footer/>
        </article>
  )
}

export default WriteQna