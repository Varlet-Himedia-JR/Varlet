import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/mypage.css';
import { getCookie } from "../../util/cookieUtil";

function MyQna() {
  const [myqnaList, setMyqnaList] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // 더 많은 데이터가 있는지 플래그
  const navigate = useNavigate();

  // 쿠키에서 userid 가져오기
  const userid = getCookie('user')?.userid;
  
  // Redux에서 로그인 사용자 정보 가져오기
  const loginUser = useSelector(state => state.user);
  const reduxUserid = loginUser.userid;

  // 로그인 사용자 ID 결정 (쿠키에서 가져오거나 Redux에서 가져오거나)
  const currentUserid = userid || reduxUserid;

  // 데이터 로드 함수
  const loadQnaList = useCallback(async (pageNum) => {
    try {
      const result = await axios.get(`/api/qna/qnaList/${pageNum}`);
      const filteredQnaList = result.data.qnaList.filter(qna => qna.userid === currentUserid);
      const sortedQnaList = filteredQnaList.sort((a, b) => a.qseq - b.qseq);

      // 데이터가 없으면 더 이상 로드하지 않음
      if (sortedQnaList.length === 0) {
        setHasMore(false);
        return;
      }

      setMyqnaList(prevList => [...prevList, ...sortedQnaList]);
      setPage(pageNum);
    } catch (err) {
      console.error(err);
    }
  }, [currentUserid]);

  // 스크롤 이벤트 핸들러
  const handleScroll = useCallback(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    // 스크롤이 페이지 하단에 도달했을 때
    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
      loadQnaList(page + 1);
    }
  }, [page, hasMore, loadQnaList]);

  // 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  // 초기 데이터 로드
  useEffect(() => {
    loadQnaList(page);
  }, [loadQnaList]);

  // 비밀번호 확인 절차 없이 바로 QnA 상세보기로 이동
  async function onQnaView(qseq) {
    let result = await axios.get(`/api/qna/getQnaView/${qseq}`);
    if (result.data.qna.security === 'N') {
      navigate(`/qnaView/${qseq}`);
    } else {
      let inputPass = window.prompt('패스워드를 입력하세요', '');
      if (inputPass === null) {
        return;
      }
      let res = await axios.post(`/api/qna/passCheck`, null, { params: { qseq, inputPass } });
      if (res.data.msg === 'OK') {
        navigate(`/qnaView/${qseq}`);
      } else {
        alert('패스워드가 일치하지 않습니다.');
      }
    }
  }

  return (
    <>
      <Heading />
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
        </div>
      </div>
      <Footer />
    </>
  );
}

export default MyQna;
