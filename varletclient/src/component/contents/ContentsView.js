import React, { useState, useEffect } from 'react'
import Heading from '../headerfooter/Heading'
import Footer from '../headerfooter/Footer'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";
import { setCookie, getCookie } from "../../util/cookieUtil";

function ContentsView() {

    const [contents, setContents] = useState({});
    const { cseq } = useParams();
    const navigate = useNavigate();


    useEffect(
        () => {
            axios.get(`/api/contents/getContentsView/${cseq}`)
                .then((result) => {
                    setContents(result.data.contents);
                    console.log(result.data.contents);
                })
                .catch((err) => { console.error(err) })
        }, []
    )

    function addSchedule(cseq) {
        navigate('/mycourse', { state: { cseq } });
    }

    return (
        <>
            <Heading />
            <div className='subPage'>

                <h2>Contents View</h2>
                <div className="contents" >
                    {
                        (contents) ? (
                            <div className='contentsview'>
                                <div>{
                                    <img className="contents-img" src={contents.contentsimg} />
                                }
                                </div>
                                <tbody>
                                    <table>
                                        <tr>
                                            <td> 번호</td>
                                            <td> {contents.cseq}</td>
                                        </tr>
                                        <tr>
                                            <td> 종류</td>
                                            <td> {contents.ctype}</td>
                                        </tr>
                                        <tr>
                                            <td>이름</td>
                                            <td> {contents.cname}</td>
                                        </tr>
                                        <tr>
                                            <td>지역</td>
                                            <td> {contents.location} {contents.location2}</td>
                                        </tr>
                                        <tr>
                                            <td>기간</td>
                                            <td>
                                                {contents.cstartTime ? contents.cstartTime.substring(0, 10) + '~' + contents.cendTime.substring(0, 10) : ''}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>비용</td>
                                            <td> {contents.cost}</td>
                                        </tr>
                                    </table>
                                </tbody>
                            </div>
                        ) : (<div>Loading</div>)
                    }
                    <div className='btns'>
                        {getCookie('user') ? (
                            <button onClick={() => { addSchedule(contents.cseq) }}>추가</button>) : (
                            <button style={{ display: 'none' }} onClick={() => { addSchedule(contents.cseq) }}>추가</button>)}
                        <button onClick={() => { navigate('/contents') }}>목록으로</button>
                    </div>
                </div>
            </div>
            {/* <Footer /> */}
        </>
    )
}

export default ContentsView
