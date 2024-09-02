import React, { useState, useEffect } from 'react'
import Heading from '../headerfooter/Heading'
import Footer from '../headerfooter/Footer'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom";
import { setCookie, getCookie } from "../../util/cookieUtil";
import jaxios from '../../util/jwtUtil';
function ContentsView() {

    const [contents, setContents] = useState({});
    const { cseq } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

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

    // 상세보기로 이동
    function contentsUpdate(cseq) {
        navigate(`/contentsUpdate/${cseq}`);
    }

    function addSchedule(contents) {
        navigate('/mycourse', { state: { contents } });
    }

    function deleteContents(cseq) {
        if (window.confirm(`삭제하시겠습니까?`)) {
            jaxios.post(`/api/contents/deleteContents/${cseq}`)
                .then(() => {
                    navigate('/contentsList');
                })
                .catch((err) => { console.error(err); });
        }
    }

    return (
        <>
            <Heading />

            <div className='subPage' style={{ backgroundColor: 'white', width: '80%', paddingTop: '100px', opacity: '0.9' }}>
                <div className="flex flex-col min-h-screen">
                    <main className="flex-1 py-8">
                        <div className="container mx-auto px-4 md:px-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>{
                                    <img className="contents-img" src={contents.contentsimg} />
                                }
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">{contents.cname}</h1>
                                    <div className="mt-4">
                                        <div className="relative w-full overflow-auto">
                                            <table className="w-full caption-bottom text-sm">
                                                <tbody className="[&_tr:last-child]:border-0">
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">번호</td>
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{contents.cseq}</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">분류</td>
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{contents.ctype}</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">콘텐츠명</td>
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{contents.cname}</td>
                                                    </tr>
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">지역</td>
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{contents.location} {contents.location2}</td>
                                                    </tr>
                                                    {contents.ctype === '축제' && <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">기간</td>
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">{contents.cstart_time ? contents.cstart_time.substring(0, 10) + '~' + contents.cend_time.substring(0, 10) : ''}</td>
                                                    </tr>}
                                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0">가격</td>
                                                        <td className="p-4 align-middle [&:has([role=checkbox])]:pr-0"> {contents.cost}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="mt-6 flex gap-2">

                                            {getCookie('user') ? (
                                                <div onClick={() => { addSchedule(contents) }}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                                        <path d="M13.5 6.5l4 4" />
                                                    </svg>
                                                    <span className="text-xl font-bold">추가</span>
                                                </div>
                                            ) : (
                                                <></>)}
                                            <div onClick={() => { navigate('/contentsList') }}
                                                className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32"
                                            >

                                                <span className="text-xl font-bold">목록으로</span>
                                            </div>


                                        </div>
                                        {isAdmin && (
                                            <div className="mt-6 flex gap-2">

                                                <div onClick={() => { contentsUpdate(cseq) }}
                                                    className="bg-black text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                                        <path d="M13.5 6.5l4 4" />
                                                    </svg>
                                                    <span className="text-xl font-bold">수정</span>
                                                </div>
                                                <div onClick={() => { deleteContents(cseq) }}
                                                    className="bg-black text-white px-4 py-2 rounded flex items-center space-x-2 cursor-pointer w-32"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M18 6l-12 12" />
                                                        <path d="M6 6l12 12" />
                                                    </svg>
                                                    <span className="text-xl font-bold">삭제</span>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>

            </div>
            <Footer />
        </>
    )
}

export default ContentsView
