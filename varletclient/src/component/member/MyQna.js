import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/customer.css';
import { getCookie } from "../../util/cookieUtil";

function MyQna() {

  const [myqnaList, setMyqnaList] = useState([]);
  const [paging, setPaging] = useState({});
  const [beginend, setBeginend] = useState([]);
  const navigate = useNavigate();

  // 쿠키에서 userid 가져오기
  const userid = getCookie('user')?.userid;
  
  // Redux에서 로그인 사용자 정보 가져오기
  const loginUser = useSelector(state => state.user);
  const reduxUserid = loginUser.userid;

  // 로그인 사용자 ID 결정 (쿠키에서 가져오거나 Redux에서 가져오거나)
  const currentUserid = userid || reduxUserid;

  useEffect(() => {
    axios.get('/api/qna/qnaList/1')
      .then((result) => {
        // 로그인한 사용자와 작성자가 동일한 게시글만 필터링
        const filteredQnaList = result.data.qnaList.filter(qna => qna.userid === currentUserid);
        // 번호를 역순으로 정렬
        const sortedQnaList = filteredQnaList.sort((a, b) => a.qseq - b.qseq);
        setMyqnaList(sortedQnaList);
        setPaging(result.data.paging);

        const pageArr = [];
        for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
          pageArr.push(i);
        }
        setBeginend(pageArr);
      })
      .catch((err) => { console.error(err); });
  }, [currentUserid]);

  function onPageMove(page) {
    axios.get(`/api/qna/qnaList/${page}`)
      .then((result) => {
        const filteredQnaList = result.data.qnaList.filter(qna => qna.userid === currentUserid);
        const sortedQnaList = filteredQnaList.sort((a, b) => a.qseq - b.qseq);
        setMyqnaList(sortedQnaList);
        setPaging(result.data.paging);

        const pageArr = [];
        for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
          pageArr.push(i);
        }
        setBeginend(pageArr);
      })
      .catch((err) => { console.error(err); });
  }

  // 비밀번호 확인 절차 없이 바로 QnA 상세보기로 이동
  async function onQnaView(qseq) {
    navigate(`/qnaView/${qseq}`);
  }

  return (
    <>
            <Heading />
            <div >
            <div className='background'><img src="http://localhost:8070/images/oceans.jpg"/></div>
            </div>
      <div className='QnaPage' style={{ paddingTop: '120px' }}>
        <div className="qnalist" style={{ flex: "4" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className='qnacenter'>MY QNA</div>
            <button className='button1' onClick={() => { navigate('/writeQna') }}>1:1 문의 작성</button>
          </div>
          <div className="qnatable">
            <div className="row1">
              <div className="col" style={{ flex: "2" }}>번호</div>
              <div className="col" style={{ flex: "4" }}>제목</div>
              <div className="col" style={{ flex: "2" }}>등록일</div>
              <div className="col" style={{ flex: "2" }}>답변여부</div>
            </div>
          </div>
          {
            myqnaList.length > 0 ? (
              myqnaList.map((qna, idx) => (
                <div className="row2" key={qna.qseq}>
                  <div className="coll" style={{ flex: "2" }}>{myqnaList.length - idx}</div> {/* 역순으로 번호 표시 */}
                  <div className="coll" style={{ flex: "3.7" }} onClick={() => { onQnaView(qna.qseq) }}>
                    {qna.subject}
                    {
                      (qna.security === 'Y') ? (
                        <img style={{ verticalAlign: "middle", marginLeft: "10px" }} src="http://localhost:8070/images/key.png" />
                      ) : (null)
                    }
                  </div>
                  <div className="coll" style={{ flex: "2" }}>{qna.indate.substring(0, 10)}</div>
                  <div className="coll" style={{ flex: "2" }}>
                    {
                      (qna.reply) ? (<div>답변완료</div>) : (<div>질문 확인 중</div>)
                    }
                  </div>
                </div>
              ))
            ) : (
              <div>등록된 문의가 없습니다.</div>
            )
          }
          <div id="paging" style={{ textAlign: "center", padding: "10px" }}>
            {
              paging.prev ? (
                <span style={{ cursor: "pointer" }} onClick={() => { onPageMove(paging.beginPage - 1) }}>
                  ◀
                </span>
              ) : (
                <div></div>
              )
            }
            {
              beginend.length > 0 ? (
                beginend.map((page, idx) => (
                  <span
                    style={{ cursor: "pointer", margin: "0 5px" }}
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
                <span style={{ cursor: "pointer" }} onClick={() => { onPageMove(paging.endPage + 1) }}>
                  ▶
                </span>
              ) : (
                <div></div>
              )
            }
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyQna;
