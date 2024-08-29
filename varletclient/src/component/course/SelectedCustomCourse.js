import React, { useState, useEffect } from 'react';
import jaxios from '../../util/jwtUtil';
import { getCookie } from '../../util/cookieUtil';

function SelectedCustomCourse({ selectedContents, mycourse }) {
    const [contents, setContents] = useState({});
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courseDuration, setCourseDuration] = useState([]);
    const [isLoading, setIsLoading] = useState(true);  // 로딩 상태 관리
    const [sdate, setSdate] = useState('');
    const [stime, setStime] = useState('');
    const [etime, setEtime] = useState('');
    const [price, setPrice] = useState('');
    const [pcount, setPcount] = useState('1');

    // selectedContents가 변경될 때 contents를 설정
    useEffect(() => {
        if (selectedContents) {
            setContents(selectedContents.contents);
        }
    }, [selectedContents]);

    // mycourse가 변경될 때 초기 selectedCourse 설정
    useEffect(() => {
        if (mycourse.length > 0) {
            setSelectedCourse(mycourse[0].tseq);
        }
    }, [mycourse]);

    // selectedCourse가 변경될 때 courseDuration 로드
    useEffect(() => {
        if (selectedCourse) {
            setIsLoading(true);  // 데이터 로드 시작 시 로딩 상태로 설정
            jaxios.get(`/api/course/getMycourse/${selectedCourse}/${getCookie('user').userid}`)
                .then((result) => {
                    const duration = result.data.duration;
                    setCourseDuration(duration);
                    if (duration.length > 0) {
                        setSdate(duration[0]);  // sdate의 초기값 설정
                    }
                })
                .catch((err) => { console.error(err); })
                .finally(() => {
                    setIsLoading(false);  // 데이터 로드 완료 시 로딩 상태 해제
                });
        }
    }, [selectedCourse]);

    // 일정 등록 함수
    const addDayschedule = async () => {
        const sDateTimeString = `${sdate}T${stime}:00`;
        const sDateObject = new Date(sDateTimeString);
        const eDateTimeString = `${sdate}T${etime}:00`;
        const eDateObject = new Date(eDateTimeString);
        const dDateString = `${sdate}T00:00:00`;
        const dDateObject = new Date(dDateString);
        try {
            let result = await jaxios.post('/api/dayschedule/insertDayschedule', {
                dtitle: contents.cname,
                cseq: contents.cseq,
                userid: getCookie('user').userid,
                tseq: selectedCourse,
                day_date: dDateObject,
                start_time: sDateObject,
                end_time: eDateObject,
                price: price,
                pcount: pcount
            });
            if (result.data.msg === 'ok') {
                alert('등록완료');
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
        }
    };

    // 코스 변경 핸들러
    const handleCourseChange = (event) => {
        setSelectedCourse(event.target.value);
    };

    return (
        <div className="rounded-lg border bg-card text-card-foreground">
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <div className="flex space-x-4">
                        <div className="space-y-2">
                            <label
                                className="text-lg text-muted-foreground font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="date"
                            >
                                나의 여행
                            </label>
                            {mycourse.length > 0 ? (
                                <div className="flex justify-between">
                                    <select
                                        id="mycourse"
                                        name="mycourse"
                                        value={selectedCourse}
                                        onChange={handleCourseChange}
                                    >
                                        {mycourse.map((course, index) => (
                                            <option key={index} value={course.tseq}>
                                                {course.tname}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <p>여행 코스를 선택할 수 없습니다.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label
                                className="text-lg text-muted-foreground font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="date"
                            >
                                날짜
                            </label>
                            <div>
                                <select
                                    id="sdate"
                                    name="sdate"
                                    value={sdate}
                                    onChange={(e) => setSdate(e.currentTarget.value)}
                                    disabled={isLoading}  // 로딩 중일 때 비활성화
                                >
                                    {isLoading ? (
                                        <option>로딩 중...</option>
                                    ) : courseDuration.length > 0 ? (
                                        courseDuration.map((day, index) => (
                                            <option key={index} value={day}>
                                                {day}
                                            </option>
                                        ))
                                    ) : (
                                        <option>날짜를 선택할 수 없습니다.</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label
                                className="text-lg text-muted-foreground font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="stime"
                            >
                                시작 시간
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="time"
                                    id="stime"
                                    name="stime"
                                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={(e) => { setStime(e.currentTarget.value) }}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label
                                className="text-lg text-muted-foreground font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="etime"
                            >
                                종료 시간
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 end-0 top-0 flex items-center pe-3.5 pointer-events-none">
                                    <svg
                                        className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="time"
                                    id="etime"
                                    name="etime"
                                    className="bg-gray-50 border leading-none border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                    onChange={(e) => { setEtime(e.currentTarget.value) }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label
                            className="text-lg text-muted-foreground font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="title"
                        >
                            제목
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="title"
                            placeholder="Enter a title"
                            value={contents.cname}
                            readOnly
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label
                            className="text-lg text-muted-foreground font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="price"
                        >
                            가격
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="price"
                            placeholder="Enter a price"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <label
                            className="text-lg text-muted-foreground font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="people"
                        >
                            인원수
                        </label>
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            id="people"
                            placeholder="Enter the number of people"
                            type="number"
                            value={pcount}
                            onChange={(e) => { setPcount(e.currentTarget.value) }}
                        />
                        <br/>
                        <button 
                            type="button" 
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" 
                            onClick={addDayschedule}
                        >
                            일정등록
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedCustomCourse;
