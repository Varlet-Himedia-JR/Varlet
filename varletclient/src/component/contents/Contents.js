import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/contents.css';
import '../../style/paging.css';

function Contents() {

    const [contentsList, setContentsList] = useState([]);
    const [paging, setPaging] = useState({});
    const [beginend, setBeginend] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/contents/contentsList/1')
            .then((result) => {
                setContentsList(result.data.contentsList);
                setPaging(result.data.paging);

                const pageArr = [];
                for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                    pageArr.push(i);
                }
                setBeginend(pageArr);
            })
            .catch((err) => { console.error(err); })
    }, [])

    function onPageMove(page) {
        axios.get(`/api/contents/contentsList/${page}`)
            .then((result) => {
                setContentsList([...result.data.contentsList]);
                setPaging(result.data.paging);

                const pageArr = [];
                for (let i = result.data.paging.beginPage; i <= result.data.paging.endPage; i++) {
                    pageArr.push(i);
                }
                setBeginend([...pageArr]);
            })
            .catch((err) => { console.error(err) })
    }

    async function onContentsView(cseq) {
        navigate(`/getContentsView/${cseq}`);
    }

    return (
        <>
            <Heading />
            <div className="contents-container">
                {
                    (contentsList && contentsList.length > 0) ? (
                        contentsList.map((contents, idx) => {
                            return (
                                <div className="contents-item" key={idx} onClick={() => { onContentsView(contents.cseq) }}>
                                    <div className="contents-row">
                                        <div className="contents-col" style={{ display: "none" }}>{contents.cseq}</div>
                                        <div className="contents-col" style={{ textAlign: "left" }}>
                                            <strong>{contents.cname}</strong>
                                            <img className="contents-img" src={contents.contentsimg} alt={contents.cname} />
                                        </div>
                                        <table>
                                            <tbody>
                                                <tr>
                                                    <td>번호</td>
                                                    <td>{contents.cseq}</td>
                                                </tr>
                                                <tr>
                                                    <td>종류</td>
                                                    <td>{contents.ctype}</td>
                                                </tr>
                                                <tr>
                                                    <td>이름</td>
                                                    <td>{contents.cname}</td>
                                                </tr>
                                                <tr>
                                                    <td>지역</td>
                                                    <td>{contents.location} {contents.location2}</td>
                                                </tr>
                                                <tr>
                                                    <td>기간</td>
                                                    <td>{contents.cstartTime.substring(0, 10)} ~ {contents.cendTime.substring(0, 10)}</td>
                                                </tr>
                                                <tr>
                                                    <td>비용</td>
                                                    <td>{contents.cost}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        })
                    ) : (<h2>list가 없습니다.</h2>)
                }
            </div>
            <div id="paging">
                {
                    paging.prev ? (
                        <span onClick={() => { onPageMove(paging.beginPage - 1) }}>
                            ◀
                        </span>
                    ) : (
                        <span></span>
                    )
                }
                {
                    beginend ? (
                        beginend.map((page, idx) => (
                            <span
                                key={idx}
                                className={paging.currentPage === page ? 'active' : ''}
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
                        <span onClick={() => { onPageMove(paging.endPage + 1) }}>
                            ▶
                        </span>
                    ) : (
                        <span></span>
                    )
                }
            </div>
            <Footer />
        </>
    )
}

export default Contents;
