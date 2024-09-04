import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import Footer from './../headerfooter/Footer';
import Heading from './../headerfooter/Heading';
import '../../style/notice.css';

function Notice() {
  
    const [noticeList, setNoticeList] = useState([]);
    const [paging, setPaging ] = useState({});
    const [ beginend, setBeginend ] = useState([]);
    const navigate = useNavigate();
  
    useEffect(
        ()=>{
            axios.get('/api/notice/noticeList/1')
            .then((result)=>{
                setNoticeList(result.data.noticeList);
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
          axios.get(`/api/notice/noticeList/${page}`)
          .then((result)=>{
              setNoticeList( [...result.data.noticeList ] );
              setPaging( result.data.paging);
  
              const pageArr = [];
              for(let i=result.data.paging.beginPage; i<=result.data.paging.endPage; i++){
                  pageArr.push(i);
              }
              setBeginend( [...pageArr] );
          })
          .catch((err)=>{console.error(err)})
      }
    
   
  
    async function onNoticeView(nseq){
            await axios.get(`/api/notice/getNoticeView/${nseq}`);
            navigate(`/noticeView/${nseq}`);
        }
      
return (
      <>
          <Heading/>
          <div className='NoticePage' style={{paddingTop:'120px'}}>
              <div className="NoticeList" style={{flex:"4"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                  <div className='notice'>공지사항</div>
              </div>
                  <div className="noticeTable">
                      <div className="notice_row">
                          <div className="notice_col" style={{flex:"2.6"}}>번호</div>
                          <div className="notice_col" style={{flex:"4"}}>제목</div>
                          <div className="notice_col" style={{flex:"2"}}>등록일</div>
                      </div>
                  </div>
               {
                  (noticeList)?(
                    noticeList.map((notice,idx)=>{
                          return(
                              <div className="notice_row2" key={idx}>
                                  <div className="notice_coll"  style={{flex:"2"}}>{notice.nseq}</div>
                                  <div className="notice_coll"  style={{flex:"4"}} onClick={()=>{(onNoticeView(notice.nseq))}}> {notice.subject}</div>
                                  <div className="notice_coll"  style={{flex:"2"}} >{notice.indate.substring(0,10)}</div>
                              </div>
                            )
                      })
                  ):("공지사항이 없습니다.")
               }
               <div id="paging" style={{textAlign:"center", padding:"10px",marginRight:"20px"}}>
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
                          <span style={{cursor:"pointer", margin: "0 5px"}}key={idx} onClick={() => { onPageMove(page) }}>
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
      <Footer/>
    </>
)

}
export default Notice