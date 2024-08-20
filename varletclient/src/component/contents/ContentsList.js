import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Heading from './../headerfooter/Heading';
import Footer from './../headerfooter/Footer';
import '../../style/contents.css';
import { getCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';


function ReviewList() {
    const [contentsList, setContentsList] = useState([]);
    const [page, setPage] = useState(1); // 현재 페이지
    const [hasMore, setHasMore] = useState(true); // 더 로드할 데이터가 있는지 여부
    const [searchTerm, setSearchTerm] = useState(''); // 검색어
    const [filteredContents, setFilteredContents] = useState([]); // 필터된 리뷰 목록
    const navigate = useNavigate();

    const writeContents = () => {
        console.log('------');
        console.log(getCookie('user'));
        if (!getCookie('user')) {
            navigate('/login');
        } else {
            for (let i = 0; i < getCookie('user').roleNames.length; i++) {
                if (getCookie('user').roleNames[i] == 'ADMIN') {
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
                setContentsList(prevReviews => [...prevReviews, ...newContents]);
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

    // 필터링 함수
    const filterContents = useCallback(() => {
        if (searchTerm.trim() === '') {
            setFilteredContents(contentsList);
        } else {
            const lowercasedTerm = searchTerm.toLowerCase();
            const filtered = contentsList.filter(contents =>
                contents.cname.toLowerCase().includes(lowercasedTerm)
            );
            setFilteredContents(filtered);
        }
    }, [searchTerm, contentsList]);

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

    // 검색어 변경 핸들러
    function handleSearchChange(event) {
        setSearchTerm(event.target.value);
    }

    // 검색어가 변경될 때마다 필터링
    useEffect(() => {
        filterContents();
    }, [searchTerm, filterContents]);

    // 검색어 클리어 핸들러
    function handleClearSearch() {
        setSearchTerm('');
    }

    function getContentsView(cseq) {
        navigate(`/getContentsView/${cseq}`);
    }


    return (
        <>
            <Heading />
            <div className='mycourseContentsList' style={{ paddingTop: '100px', bottom: '100px' }}>
                <div className="contents-container" style={{ paddingTop: '100px' }}>
                    <div className="search-container" style={{ marginBottom: "20px", width: "100%" }}>
                        <input
                            className='search-bar'
                            type="text"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            placeholder="축제명으로 검색"
                        />
                        {searchTerm && (
                            <button className="clear-button" onClick={handleClearSearch}>
                                &times; {/* 'X' 문자 */}
                            </button>
                        )}
                        {/* <button className='writeButton' onClick={writeContents}>등록</button> */}
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
                    </div>
                    {
                        Array.isArray(filteredContents) && filteredContents.length > 0 ? (
                            filteredContents.map((contents, idx) => (
                                <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-all hover:scale-105" key={idx} onClick={() => { getContentsView(contents.cseq) }}>
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
                                        <p className="text-muted-foreground mb-4">{contents.cstartTime.substring(0, 10)} - {contents.cendTime.substring(0, 10)}</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-primary font-semibold">{contents.cost == 0 ? '무료' : contents.cost}</span>
                                            {/* <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3">
                                                Buy Now
                                            </button> */}
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

export default ReviewList;
