import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';
import {  getCookie} from "../../util/cookieUtil";
function Qna() {

  const [qnaList, setQnaList] = useState([]);
  const [paging, setPaging ] = useState({});
  const [ beginend, setBeginend ] = useState([]);
  const navigate = useNavigate();
  const usercookie = getCookie('user');

  useEffect(
      ()=>{
          axios.get('/api/qna/qnaList/1')
          .then((result)=>{
              setQnaList(result.data.qnaList);
              setPaging(result.data.paging);

              const pageArr = [];
              for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                  pageArr.push(i);
              }
              setBeginend(pageArr);
              console.log('Paging:', paging);
                console.log('Beginend:', beginend);
          })
          .catch((err)=>{console.error(err);})
      },[]
  )

  function onPageMove(page){
        // 페이지 표시방식
        axios.get(`/api/qna/qnaList/${page}`)
        .then((result)=>{
            setQnaList( [...result.data.qnaList ] );
            setPaging( result.data.paging);

            const pageArr = [];
            for(let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                pageArr.push(i);
            }
            setBeginend( [...pageArr] );
        })
        .catch((err)=>{console.error(err)})
    }
  
 

    async function onQnaView(qseq){
      let result = await axios.get(`/api/qna/getQnaView/${qseq}`);
      if(result.data.qna.security == 'N'){
        let inputPass = window.prompt('패스워드를 입력하세요','');
            if (inputPass === null) {
                return; 
            }
          let res = await axios.post(`/api/qna/passCheck`,null,{params:{qseq,inputPass}});
          console.log(res.data.msg);
          
          if(res.data.msg == 'OK'){
              navigate(`/QnaView/${qseq}`);
          }else{
              return alert('패스워드가 일치하지 않습니다.')
          }
        }else{
        navigate(`/qnaView/${qseq}`);
      }
    }

    async function writeQna(){
        if(usercookie==null){
            return alert('로그인 후 이용해주세요'); 
        }else{
            if(usercookie != null){
                navigate('/writeQna');
            }
        }

    }
    
  return (
    <>
        <Heading/>
        <div className='main' style={{marginTop:'80px'}}>  
            <div className='QnaPage'>
                <div className="qnalist">
                    <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div className='qnacenter'>고객센터</div>
                        <button className='button1' onClick={()=>{  writeQna()  }}>1:1 문의 작성</button>
                    </div>
                    <div className="qnatable">
                        <div className="row1">
                            <div className="col" style={{flex:"2"}}>번호</div>
                            <div className="col" style={{flex:"4"}}>제목</div>
                            <div className="col" style={{flex:"2"}}>등록일</div>
                            <div className="col" style={{flex:"2"}}>답변여부</div>
                        </div>
                    </div>
                {
                    (qnaList)?(
                        qnaList.map((qna,idx)=>{
                            return(
                                <div className="row2" key={idx}>
                                    <div className="coll"  style={{flex:"2",cursor:'pointer'}}>{qna.qseq}</div>
                                    <div className="coll"  style={{flex:"3.7",cursor:'pointer'}} onClick={()=>{(onQnaView(qna.qseq))}}>
                                        {qna.subject}
                                        { 
                                            (qna.security == 'N')?(
                                                <img src="http://localhost:8070/uploads/key.png"/>
                                            ):(null)
                                        }
                                    </div>
                                    <div className="coll"  style={{flex:"2"}} >{qna.indate.substring(0,10)}</div>
                                    <div className="coll"  style={{flex:"2"}} >
                                        {
                                            (qna.reply)?(<div>답변완료</div>):(<div>질문 확인 중</div>)
                                        }
                                    </div>
                                </div>
                            )
                        })
                    ):(null)
                }
                <div id="paging" style={{textAlign:"center", padding:"10px"}}>
                {
                    paging.prev ? (
                        <span style={{cursor:"pointer"}} onClick={() => { onPageMove(paging.beginPage - 1) }}>
                            ◀
                        </span>
                    ) : (
                        <div></div>
                    )
                }
                {
                    beginend ? (
                        beginend.map((page, idx) => (
                            <span 
                                style={{cursor:"pointer", margin: "0 5px"}}
                                key={idx}
                                onClick={() => { onPageMove(page) }}
                            >
                                {page}
                            </span>
                        ))
                    ) : (
                        <span>1</span>
                    )
                }
                {
                    paging.next ? (
                        <span style={{cursor:"pointer"}} onClick={() => { onPageMove(paging.endPage + 1) }}>
                            ▶
                        </span>
                    ) : (
                        <div></div>
                    )
                }
            </div>
            </div>
        </div>
    </div>
    <Footer/>
    </>
  )
}

export default Qna