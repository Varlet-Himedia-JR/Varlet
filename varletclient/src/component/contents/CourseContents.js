import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import { getCookie } from '../../util/cookieUtil';
import '../../style/paging.css';
import '../../style/review.css';
import jaxios from '../../util/jwtUtil';

function CourseContents({ courseDuration, selectedCourse }) {

    const [contentsList, setContentsList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true);
    const [selectedContents, setSelectedContents] = useState({});
    const [days, setDays] = useState([]);
    const [sdate, setSdate] = useState('');
    // const [edate, setEdate] = useState('');
    const [stime, setStime] = useState('');
    const [etime, setEtime] = useState('');
    const [dayschedule, setDayschedule] = useState({});
    const [tseq, setTseq] = useState('');
    const [price, setPrice] = useState('');
    const [pcount, setPcount] = useState('1');
    const navigate = useNavigate();

    const onInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'sdate') {
            setSdate(value);
        } else if (name === 'edate') {
            // setEdate(value);
        }
    };

    // const handleStart_timeChange = (event) => {
    //     setStart_time(event.target.value);
    // };
    // const handleEnd_timeChange = (event) => {
    //     setEnd_time(event.target.value);
    // };

    useEffect(() => {
        if (courseDuration && courseDuration.length > 0) {
            setDays(courseDuration);
            setSdate(courseDuration[0]);
            // setStart_time(days[0]);
            // setEnd_time(days[days.length-1]);
        }
    }, [courseDuration]);


    // 데이터 로드 함수
    const loadContents = useCallback(async (pageNumber) => {
        try {
            const result = await axios.get(`/api/contents/contentsList/${pageNumber}`);
            const { contentsList: newContents, paging } = result.data;

            if (Array.isArray(newContents) && newContents.length > 0) {
                setContentsList(preContents => [...preContents, ...newContents]);
                setPage(pageNumber);

                // 다음 페이지가 없으면 hasMore를 false로 설정
                if (!paging || (paging && paging.next === null)) {
                    setHasMore(false);
                }
            } else {
                setHasMore(false);
            }
        } catch (err) {
            console.error(err);
        }
    }, []);

    // 스크롤 이벤트 핸들러
    const handleScroll = useCallback(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        // 스크롤이 페이지 하단에 도달했을 때
        if (scrollTop + clientHeight >= scrollHeight - 5 && hasMore) {
            loadContents(page + 1);
        }
    }, [page, hasMore, loadContents]);

    // 컴포넌트 마운트 시 스크롤 이벤트 리스너 추가
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    // 초기 데이터 로드
    useEffect(() => {
        loadContents(page);
    }, [loadContents, page]);

    // function onContentsView(rseq) {
    //     navigate(`/reviewView/${rseq}`);
    // }
    const onChangeAddContents = (contents) => {
        setSelectedContents(contents);
        if (isAddContentsVisible) {
            setIsAddContentsVisible(false);
        } else {
            setIsAddContentsVisible(true);
        }
    };


    useEffect(() => {

        axios.get(`/api/timetable/getTseq/${selectedCourse}`)
            .then((result) => {
                console.log(selectedContents)
                console.log(selectedCourse);
                console.log(result.data.tseq);
                console.log(result.tseq);
                setTseq(result.data.tseq);

            })
            .catch((err) => { console.error(err); });
    }, []);

    const addDayschedule = async () => {

        const sDateTimeString = `${sdate}T${stime}:00`;
        const sDateObject = new Date(sDateTimeString);
        const eDateTimeString = `${sdate}T${etime}:00`;
        const eDateObject = new Date(eDateTimeString);
        // setTemp(new Date(`${sdate}T${etime}:00`));
        // setDayschedule({
        //     dtitle: selectedContents.dname,
        //     cseq: selectedContents.cseq,
        //     userid: getCookie('user').userid,
        //     tseq: tseq,
        //     day_date: sDateObject,
        //     start_time: sDateObject,
        //     end_time: eDateObject,
        //     price: price,
        //     pcount: pcount
        // }
        // )
        try {
            console.log("stringggg : ", sDateTimeString)
            console.log("berfore insert : ", { dtitle: selectedContents.cname, cseq: selectedContents.cseq, userid: getCookie('user').userid, tseq: tseq, day_date: sDateObject, start_time: sDateObject, end_time: eDateObject, price: price, pcount: pcount });
            let result = await jaxios.post('/api/dayschedule/insertDayschedule', {
                dtitle: selectedContents.cname,
                cseq: selectedContents.cseq,
                userid: getCookie('user').userid,
                tseq: tseq,
                day_date: sDateObject,
                start_time: sDateObject,
                end_time: eDateObject,
                price: price,
                pcount: pcount
            });
            if (result.data.msg == 'ok') {
                alert('등록완료');
                setIsAddContentsVisible(false);
            }
        } catch (err) {
            console.error(err);
        }


    }

    const [isAddContentsVisible, setIsAddContentsVisible] = useState(false);

    return (
        <article>
            <div className='subPage'>
                <div className='reviewList' style={{ flex: "4" }}>
                    <div className="reviewtable">
                        <div className='row'>
                            <div className="col">번호</div>
                            <div className="col">이름</div>
                            <div className="col">종류</div>
                            <div className="col">지역</div>
                            <div className="col">시작기간</div>
                            <div className="col">종료기간</div>
                        </div>
                        {
                            Array.isArray(contentsList) && contentsList.length > 0 ? (
                                contentsList.map((contents, idx) => (
                                    <div className="row" key={idx} onClick={() => onChangeAddContents(contents)}>
                                        <div className="col">{contents.cseq}</div>
                                        <div className="col" style={{ textAlign: "left" }} >
                                            {contents.cname}
                                        </div>
                                        <div className="col">{contents.ctype}</div>
                                        <div className="col">{contents.location} {contents.location2}</div>
                                        <div className="col">{contents.cstartTime ? contents.cstartTime.toString().substring(0, 10) : ''}</div> {/* 수정된 날짜가 여기에 표시됩니다 */}
                                        <div className="col">{contents.cendTime ? contents.cendTime.toString().substring(0, 10) : ''}</div> {/* 수정된 날짜가 여기에 표시됩니다 */}
                                    </div>
                                ))
                            ) : (
                                <div>리뷰가 없습니다.</div>
                            )
                        }
                    </div>
                    {/* 로딩 중 표시 */}
                    {hasMore && <div className="loading">Loading more reviews...</div>}
                    {isAddContentsVisible && (
                        <div className="add_contents" >
                            <div className="cchead" style={{ border: '1px solid black', display: 'flex', justifyContent: 'space-between' }}>
                                <h2>AddContents On {selectedCourse}</h2>
                                <button style={{ border: '1px solid black' }} onClick={onChangeAddContents}>
                                    X
                                </button>
                            </div>
                            <div>{getCookie('user').userid}</div>
                            <select
                                id="sdate"
                                name="sdate"
                                value={sdate}
                                onChange={(e) => { setSdate(e.currentTarget.value) }}
                            >
                                {days.map((day, index) => (
                                    <option key={index} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select>
                            <input type="time" id="stime" name="stime" min="00:00" max="23:59" required onChange={(e) => { setStime(e.currentTarget.value) }} />
                            {/* <select
                                id="edate"
                                name="edate"
                                value={edate}
                                onChange={onInputChange}
                            >
                                {days.map((day, index) => (
                                    <option key={index} value={day}>
                                        {day}
                                    </option>
                                ))}
                            </select> */}
                            <input type="time" id="etime" name="etime" min="00:00" max="23:59" required onChange={(e) => { setEtime(e.currentTarget.value) }} />
                            <div>
                                <label>제목</label>
                                <input type="text" value={selectedContents.cname} />
                            </div>
                            <div>
                                <label>가격</label>
                                <input type="text" value={selectedContents.price} onChange={(e) => { setPrice(e.currentTarget.value) }}/>
                            </div>
                            <div>
                                <label>인원 수</label>
                                <input type="text" value={1} onChange={(e) => { setPcount(e.currentTarget.value) }} />
                            </div>
                            {/* <div>
                                <label>참고용 시간값</label>
                                {selectedContents.cstartTime}
                            </div>
                            <div>
                                <label>내 시간값</label>
                                {temp}
                            </div> */}

                            {/* <div className="contents-item" style={{ hover: 'none' }}>
                                <div className="contents-row">
                                    <div className="contents-col" style={{ display: "none" }}>{selectedContents.cseq}</div>
                                    <div className="contents-col" style={{ textAlign: "left" }}>
                                        <h2>{tseq}</h2>
                                        <strong>{selectedContents.cname}</strong>
                                        <img className="contents-img" src={selectedContents.contentsimg} alt={selectedContents.cname} />
                                    </div>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>번호</td>
                                                <td>{selectedContents.cseq}</td>
                                            </tr>
                                            <tr>
                                                <td>종류</td>
                                                <td>{selectedContents.ctype}</td>
                                            </tr>
                                            <tr>
                                                <td>이름</td>
                                                <td>{selectedContents.cname}</td>
                                            </tr>
                                            <tr>
                                                <td>지역</td>
                                                <td>{selectedContents.location} {selectedContents.location2}</td>
                                            </tr>
                                            <tr>
                                                <td>기간</td>
                                                <td>{selectedContents.cstartTime.substring(0, 10)} ~ {selectedContents.cendTime.substring(0, 10)}</td>
                                            </tr>
                                            <tr>
                                                <td>비용</td>
                                                <td>{selectedContents.cost}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div> */}
                            <button onClick={addDayschedule}>일정등록</button>
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}

export default CourseContents
