import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/contents.css';
import { getCookie } from "../../util/cookieUtil";


function ContentsList() {
    const [contentsList, setContentsList] = useState([]); // 컨텐츠 목록
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
    const [searchTerm, setSearchTerm] = useState(''); // 검색어
    const [filteredContents, setFilteredContents] = useState([]); // 필터된 리뷰 목록
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // 컨텐츠 등록 (관리자만 가능)
    const writeContents = () => {
        if (!getCookie('user')) {
            navigate('/login');
        } else {
            for (let i = 0; i < getCookie('user').roleNames.length; i++) {
                if (getCookie('user').roleNames[i] === 'ADMIN') {
                    return navigate('/contentsWrite');
                }
            }
            alert('권한이 없습니다');
        }
    }



    // 데이터 로드 함수
    const loadContents = useCallback(async (pageNumber) => {
        try {
            const result = await axios.get(`/api/contents/contentsList/${pageNumber}`);
            const { contentsList: newContents, paging } = result.data;

            if (Array.isArray(newContents) && newContents.length > 0) {
                setContentsList(prevContents => {
                    // 기존에 있는 내용과 새로운 내용을 합쳐서 중복을 제거함
                    const combinedContents = [...prevContents, ...newContents];
                    const uniqueContents = Array.from(new Set(combinedContents.map(content => content.cseq)))
                        .map(cseq => combinedContents.find(content => content.cseq === cseq)); // cseq로 구별하여 중복컨텐츠 제거
                    return uniqueContents;
                });

                setPage(pageNumber);

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

    // 필터링 함수
    const filterContents = useCallback(async () => {
        if (searchTerm.trim() === '') {
            setFilteredContents(contentsList);
        } else {
            const result = await axios.get('/api/contents/search', { params: { query: searchTerm } })
            const newContents = result.data.contentsList; // 서버 응답의 데이터 구조에 맞게 필드 수정
            setFilteredContents(newContents); // 서버에서 받은 필터링된 결과를 상태에 저장
        }
    }, [searchTerm, contentsList]);

    // 스크롤 이벤트 핸들러
    const handleScroll = useCallback(() => {
        const scrollTop = document.documentElement.scrollTop; // 현재위치
        const scrollHeight = document.documentElement.scrollHeight; // 스크롤 가능한 크기
        const clientHeight = document.documentElement.clientHeight; // 내용물의 크기

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

    useEffect(() => {
        if (getCookie('user')) {
            for (let i = 0; i < getCookie('user').roleNames.length; i++) {
                if (getCookie('user').roleNames[i] === 'ADMIN') {
                    setIsAdmin(true);
                    break;
                }
            }
        }
    }, []);

    // 초기 데이터 로드
    useEffect(() => {
        loadContents(page);
    }, [loadContents, page]);

    // 검색어 변경 핸들러
    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    // 검색어가 변경될 때마다 필터링
    useEffect(() => {
        filterContents();
    }, [searchTerm, filterContents]);





    // 검색창 초기화 
    function handleClearSearch() {
        setSearchTerm('');
    }


    // 상세보기로 이동
    function getContentsView(cseq) {
        navigate(`/getContentsView/${cseq}`);
    }


    return (
        <>
            <Heading />
            {/* <div style={{ paddingTop: '100px' }}>
                <div className='background'><img src="http://localhost:8070/images/oceans.jpg" /></div>
            </div> */}

            <div className='mycourseContentsList' style={{ marginTop: '80px', bottom: '100px' }}>
                <div className="contents-container flex flex-wrap justify-between" >
                    <h1 className="text-4xl font-bold text-gray-800">
                        <br />
                        국내 다양한 컨텐츠들을 즐겨보세요
                    </h1>
                    <div className="search-container" style={{ marginBottom: "20px", width: "100%" }}>
                        <input
                            className='search-bar'
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="축제명으로 검색"
                        />
                        {searchTerm && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-backspace cursor-pointer" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#000000" fill="none" strokeLinecap="round" strokeLinejoin="round" onClick={handleClearSearch} >
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M20 6a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-11l-5 -5a1.5 1.5 0 0 1 0 -2l5 -5z" />
                                <path d="M12 10l4 4m0 -4l-4 4" />
                            </svg>
                        )}
                        {isAdmin &&
                            <div
                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32"
                                onClick={writeContents}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                    <path d="M13.5 6.5l4 4" />
                                </svg>
                                <span className="text-xl font-bold">등록</span>
                            </div>
                        }
                    </div>
                    {
                        Array.isArray(filteredContents) && filteredContents.length > 0 ? (
                            filteredContents.map((contents, idx) => (
                                <div className="bg-white w-1/5 p-4 rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105" key={idx} onClick={() => { getContentsView(contents.cseq) }}>
                                    <img
                                        src={contents.contentsimg}
                                        alt="Product 1"
                                        width="600"
                                        height="450"
                                        className="w-full h-60 object-cover"
                                        style={{ aspectRatio: '400 / 300', objectFit: 'cover' }}
                                    />
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2">{contents.cname}</h3>
                                        <p className="text-muted-foreground mb-4">{contents.location} {contents.location2}</p>
                                        {contents.ctype==='축제' && <p className="text-muted-foreground mb-4">{contents.cstart_time.substring(0, 10)} - {contents.cend_time.substring(0, 10)}</p>}
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary font-semibold">
                                                &#8361; : {contents.cost === 0
                                                    ? (contents.ctype === '축제' ? '무료' : '상세 참조')
                                                    : contents.cost}
                                            </span>

                                            <span className="text-primary font-semibold">{contents.ctype}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (<h2>list가 없습니다.</h2>)
                    }
                </div>
            </div>

            <Footer />
        </>
    );
}

export default ContentsList;
