import React, { useState, useEffect, useRef } from 'react';
import jaxios from '../../util/jwtUtil';
import Footer from './../headerfooter/Footer';
import '../../style/course.css';
import CourseContents from '../contents/CourseContents';
import Timetablemaker from './Timetablemaker';
import Timetable from './Timetable';
import { getCookie } from "../../util/cookieUtil";
import { useLocation } from 'react-router-dom';
import Heading from '../headerfooter/Heading';

function Mycourse() {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [mycourse, setMycourse] = useState([]);
    const [courseDuration, setCourseDuration] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const userCookie = getCookie('user');
    const [ttmaker, setTtmaker] = useState();
    const location = useLocation();
    const { cseq } = location.state || {};
    const [cellWidth, setCellWidth] = useState(0);
    const [isCourseContentsVisible, setIsCourseContentsVisible] = useState(false);
    const [isCourseCustom, setIsCourseCustom] = useState(false);

    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    useEffect(() => {
        if (cseq) {
            setIsCourseContentsVisible(true);
        }
    }, [cseq]);

    useEffect(() => {
        jaxios.get(`/api/course/getTnames/${userCookie.userid}`)
            .then((result) => {
                setMycourse(result.data.mycourse);
                if (result.data.mycourse.length > 0) {
                    setSelectedCourse(result.data.mycourse[0]);
                }
            })
            .catch((err) => { console.error(err); });
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            jaxios.get(`/api/course/getMycourse/${selectedCourse}/${userCookie.userid}`)
                .then((result) => {
                    setCourseDuration(result.data.duration);
                    // const cellElement = document.querySelector('.cell');
                    // if (cellElement) {
                    //     const width = cellElement.getBoundingClientRect().width;
                    //     setCellWidth(width);
                    // }
                    setDaySchedule(result.data.dayschedule);
                })
                .catch((err) => { console.error(err); });
        }
    }, [selectedCourse]);



    const selectComponent = {
        ttmaker: <Timetablemaker />,
    };

    const handleClickButton = e => {
        const { name } = e.target;
        if (ttmaker === '') {
            setTtmaker(name);
        } else {
            setTtmaker('');
        }
    };


    const getHeight = () => {
        if (isCourseCustom || isCourseContentsVisible) {
            return '50%';
        }
        return '100%';
    };

    const onChangeCourseContents = () => {
        setIsCourseContentsVisible(!isCourseContentsVisible);
    };

    const onChangeCourseCustom = () => {
        setIsCourseCustom(!isCourseCustom);
    };

    return (

        <div style={{ width: '100%' }}>
            <Heading />
            <div>
                <div className='mycourse_container' style={{ position: 'relative', top: '100px' }}>
                    <div className="coursemenu" style={{
                    }}>

                        <div className='course' style={{ width: '100%' }}>
                            <label htmlFor="mycourse">여행 코스를 고르세요</label>
                            <select
                                id="mycourse"
                                name="mycourse"
                                value={selectedCourse}
                                onChange={handleCourseChange}
                            >
                                {mycourse.map((course, index) => (
                                    <option key={index} value={course}>
                                        {course}
                                    </option>
                                ))}
                            </select>
                            <p>Selected Course: {selectedCourse}</p>
                        </div>
                        <div className='course' style={{ width: '100%' }}>
                            {getCookie('user') ? (
                                <button onClick={handleClickButton} name='ttmaker' >
                                    여행코스 만들기
                                </button>
                            ) : (<></>)}
                            {ttmaker === '' ? <></> : ttmaker && <Timetablemaker>{selectComponent[ttmaker]}</Timetablemaker>}
                        </div>
                    </div>
                    <Timetable courseDuration={courseDuration} daySchedule={daySchedule} />

                </div>
                <div className="flex flex-col min-h-screen">
                    <div className="flex flex-1">
                        <aside className="w-64 p-4 border-r">
                            <div className="mb-4">
                                <button
                                    type="button"
                                    role="combobox"
                                    aria-controls="radix-:r0:"
                                    aria-expanded="false"
                                    aria-autocomplete="none"
                                    dir="ltr"
                                    data-state="closed"
                                    data-placeholder=""
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    id="semester"
                                    aria-label="Semester"
                                >
                                    <span style={{ pointerEvents: 'none' }}>2024년 2학기</span>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-chevron-down h-4 w-4 opacity-50"
                                        aria-hidden="true"
                                    >
                                        <path d="m6 9 6 6 6-6"></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="mb-4 p-4 border rounded-md">
                                <div className="flex justify-between mb-2">
                                    <div>시간표 1</div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1">
                                        이미지
                                    </button>
                                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 flex-1">
                                        설정
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                    <div>시간표 1</div>
                                    <div className="text-xs text-muted-foreground">기본시간표</div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-red-500">
                                        + 새 시간표 만들기
                                    </button>
                                    <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-red-500">
                                        + 마법사로 시간표 만들기
                                    </button>
                                </div>
                            </div>
                        </aside>
                        <main className="flex-1 p-4">
                            <div className="grid grid-cols-6 gap-4">
                                <div className="col-span-1 text-center">월</div>
                                <div className="col-span-1 text-center">화</div>
                                <div className="col-span-1 text-center">수</div>
                                <div className="col-span-1 text-center">목</div>
                                <div className="col-span-1 text-center">금</div>
                                <div className="col-span-1 text-center">토</div>
                            </div>
                            <div className="grid grid-cols-6 gap-4 mt-4">
                                <div className="col-span-1 h-24 border">오전 9시</div>
                                <div className="col-span-1 h-24 border">오전 10시</div>
                                <div className="col-span-1 h-24 border">오전 11시</div>
                                <div className="col-span-1 h-24 border">오후 12시</div>
                                <div className="col-span-1 h-24 border">오후 1시</div>
                                <div className="col-span-1 h-24 border">오후 2시</div>
                                <div className="col-span-1 h-24 border">오후 3시</div>
                                <div className="col-span-1 h-24 border">오후 4시</div>
                                <div className="col-span-1 h-24 border">오후 5시</div>
                                <div className="col-span-1 h-24 border">오후 6시</div>
                                <div className="col-span-1 h-24 border">오후 7시</div>
                                <div className="col-span-1 h-24 border">오후 8시</div>
                                <div className="col-span-1 h-24 border">오후 9시</div>
                            </div>
                            <div className="absolute bottom-4 right-4 flex gap-2">
                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-red-500">
                                    수업 목록에서 검색
                                </button>
                            </div>
                        </main>
                    </div>
                </div>
            </div>
            <ul className='floating'>
                <li className="button search" onClick={onChangeCourseContents}>콘텐츠 목록에서 검색</li>
                <li className="button custom" onClick={onChangeCourseCustom}>직접 추가</li>
            </ul>


            {isCourseContentsVisible && (
                <div className="course_contents" >
                    <div className="cchead" style={{ display: 'flex', justifyContent: 'center' }}>
                        <h2>course_contents</h2>
                        <button style={{ border: '1px solid black' }} onClick={onChangeCourseContents}>
                            X
                        </button>
                    </div>
                    <CourseContents courseDuration={courseDuration} selectedCourse={selectedCourse} cseq={cseq} />
                </div>
            )}
            {isCourseCustom && (
                <div className="course_contents" >
                    <div className="cchead" style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h2>course_custom</h2>
                        <button style={{ border: '1px solid black' }} onClick={onChangeCourseCustom}>
                            X
                        </button>
                    </div>

                </div>
            )}

            <Footer />
        </div>
    );
}

export default Mycourse;
