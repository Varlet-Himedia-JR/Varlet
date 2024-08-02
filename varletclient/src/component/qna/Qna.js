import React ,{useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import '../../style/customer.css';
function Qna() {

  const [qnaList, setQnaList] = useState([]);
  const [paging, setPaging ] = useState({});
  const navigate = useNavigate();

  useEffect(
      ()=>{
          axios.get('/api/qna/qnaList/1')
          .then((result)=>{
              setQnaList(result.data.qnaList);
              setPaging(result.data.paging);
          })
          .catch((err)=>{console.error(err);})
      },[]
  )

  function onPageMove(page){
  
          // 스크롤 방식
          axios.get(`/api/customer/qnaList/${page}`)
          .then((result)=>{
              setPaging( result.data.paging);
              let qnas=[]; 
              qnas = [...qnaList]; 
              qnas = [...qnas, ...result.data.qnaList ]; 
              setQnaList( [...qnas] ); 
          })
          .catch((err)=>{console.error(err)})
  }
  
  useEffect(
      ()=>{
          // 컴포넌트 시작할때 
          window.addEventListener("scroll", handleScroll);
          // scroll 이벤트가 발생하면 handleScroll 함수를 호출해서 실행해주세요

          //컴포넌트가 끝날때 실행하는 명령
          return () => {
              // scroll event listener 해제
              window.removeEventListener("scroll", handleScroll);
          }
      }
  );

 

  

  const handleScroll=()=>{
      // scroll 이벤트가 일어나면 실행될 함수
      const scrollHeight = document.documentElement.scrollHeight - 10; // 스크롤이 가능한 크기
      const scrollTop = document.documentElement.scrollTop;  // 현재 위치
      const clientHeight = document.documentElement.clientHeight; // 내용물의 크기
      // 스크롤을 시도하여 이동한 현재위치값에  내용물 크기를 더한값이 스코롤할 수 있는크기(한계)를 넘어섰다면 -> 화면 밑에까지 끝까지 스롤했다면
      if( paging.page && scrollTop + clientHeight >= scrollHeight ) {
          onPageMove( Number(paging.page) + 1 );
      }
  }

  async function onQnaView(qseq){
      let result = await axios.get(`/api/customer/getQnaView/${qseq}`);
      if(result.data.qna.security == 'N'){
          navigate(`/qnaView/${qseq}`);
      }else{
          let inputPass = window.prompt('패스워드를 입력하세요','');
          let res = await axios.post(`/api/customer/passCheck`,null,{params:{qseq,inputPass}});
          if(res.data.msg == 'OK'){
              navigate(`/qnaView/${qseq}`);
          }else{
              return alert('패스워드가 일치하지 않습니다.')
          }
      }
  }
    
  return (
    <article>
        <div className='subPage'>

            <div className="qnalist" style={{flex:"4"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
                <h2>Qna List</h2>
                <button onClick={()=>{navigate('/writeQna')}}>1:1 문의 작성</button>
            </div>
                <div className="qnatable">
                    <div className="row">
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
                            <div className="row" key={idx}>
                                <div className="col"  style={{flex:"2"}}>{qna.qseq}</div>
                                <div className="col"  style={{flex:"4",textAlign:"left"}} onClick={()=>{(onQnaView(qna.qseq))}}>
                                    {qna.subject}
                                    {
                                        (qna.security == 'Y')?(
                                            <img style={{verticalAlign:"middle",marginLeft:"10px"}} src="http://localhost:8070/images/key.png"/>
                                        ):(null)
                                    }
                                </div>
                                <div className="col"  style={{flex:"2"}} >{qna.indate.substring(0,10)}</div>
                                <div className="col"  style={{flex:"2"}} >
                                    {
                                        (qna.reply)?(<div>답변완료</div>):(<div>질문 확인 중</div>)
                                    }
                                </div>
                            </div>
                        )
                    })
                ):(null)
             }
        </div>
    </div>
    
    </article>
  )
}

export default Qna