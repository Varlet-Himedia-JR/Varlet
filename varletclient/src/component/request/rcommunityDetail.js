import React from 'react';
import { useParams } from 'react-router-dom'; // react-router-dom을 사용하여 URL 파라미터를 처리합니다.
import { useState, useEffect } from 'react';
import axios from 'axios';

const CommunityDetail = () => {
    const { gseq } = useParams(); // gseq는 URL에서 추출한 파라미터입니다.
    const [communityVO, setCommunityVO] = useState({});
    const [communityReplies, setCommunityReplies] = useState([]);
    const [replyAllcount, setReplyAllcount] = useState(0);
    const [loginUser, setLoginUser] = useState({ userid: null });

    useEffect(() => {
        axios.get('/api/community/RCommunityDetail/' + gseq)
        const fetchData = async () => {
            // 여기서 API 호출을 통해 communityVO, communityReplies, replyAllcount, loginUser를 가져옵니다.
            // 예: const data = await fetch(`/api/community/${gseq}`);
            // const result = await data.json();
            // setCommunityVO(result.communityVO);
            // setCommunityReplies(result.communityReplies);
            // setReplyAllcount(result.replyAllcount);
            // setLoginUser(result.loginUser);
        };

        fetchData();
    }, [gseq]);

    const deleteCommunity = (gseq) => {
        // 삭제 로직 구현
    };

    const deleteCommunityReply = (grseq, gseq) => {
        // 댓글 삭제 로직 구현
    };

    const handleRecommend = () => {
        // 추천 버튼 클릭 시 로직 구현
    };

    return (
        <section className="p-4">
            <div className="flex justify-between items-center border-b border-gray-300 pb-4 mb-4">
                <div className="text w-full">
                    <div className="text-gray-500 font-bold mb-4">no.{communityVO.gseq}</div>
                    <div className="flex flex-col mb-6">
                        <div className="text-2xl font-bold pb-10">
                            {communityVO.kind === 1 && '[고민]'}
                            {communityVO.kind === 2 && '[자랑]'}
                            {communityVO.kind === 3 && '[잡담]'}
                            {communityVO.subject}
                        </div>
                        <div className="flex items-center text-gray-500">
                            {communityVO.saveImage ? (
                                <div className="w-12 h-12 overflow-hidden rounded-full mr-4">
                                    <img src={`images/${communityVO.saveImage}`} className="object-cover w-full h-full" alt="Community"/>
                                </div>
                            ) : (
                                <div className="w-12 h-12 overflow-hidden rounded-full mr-4">
                                    <img src="images/repl-noimg.png" className="object-cover w-full h-full" alt="No Image"/>
                                </div>
                            )}
                            <div className="mr-4">{communityVO.nickname}[{communityVO.userid}]</div>
                            <div className="mr-4">추천 수[{communityVO.recommands}]</div>
                            <div>조회수: {communityVO.vcount}</div>
                        </div>
                    </div>
                </div>
                <div>
                    {loginUser.userid && (
                        communityVO.userid === loginUser.userid && (
                            <div className="flex space-x-4 mt-2">
                                <button 
                                    className="bg-gray-200 text-black border border-black px-4 py-2 rounded cursor-pointer hover:bg-black hover:text-white"
                                    onClick={() => window.location.href = `zootopia.do?command=communityUpdateForm&gseq=${communityVO.gseq}`}
                                >
                                    수정
                                </button>
                                <button 
                                    className="bg-black text-white border border-black px-4 py-2 rounded cursor-pointer hover:bg-white hover:text-black"
                                    onClick={() => deleteCommunity(communityVO.gseq)}
                                >
                                    삭제
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className="bg-gray-100 p-4 rounded">
                <div className="text-lg mb-6">
                    <pre className="whitespace-pre-wrap">{communityVO.content}</pre>
                </div>
                <div className="flex space-x-4">
                    <button 
                        className="bg-black text-white border border-black px-6 py-3 rounded hover:bg-white hover:text-black"
                        onClick={handleRecommend}
                    >
                        추천
                    </button>
                    <button 
                        className="bg-gray-200 text-black border border-black px-4 py-2 rounded cursor-pointer hover:bg-black hover:text-white"
                        onClick={() => window.location.href = 'zootopia.do?command=communityBoard'}
                    >
                        목록으로
                    </button>
                </div>
            </div>

            <div className="mt-10">
                <h2 className="text-2xl font-semibold border-t border-gray-300 pt-6 mb-6">댓글 {replyAllcount}개</h2>
                {loginUser.userid && (
                    <form className="flex flex-col mb-5" action="zootopia.do?command=writeCommunityReply" method="post">
                        <textarea 
                            className="w-full h-24 p-3 border border-gray-300 rounded mb-2" 
                            name="content" 
                            required
                        />
                        <input type="hidden" name="gseq" value={communityVO.gseq} />
                        <button 
                            className="bg-black text-white px-4 py-2 rounded hover:bg-white hover:text-black" 
                            type="submit"
                        >
                            작성하기
                        </button>
                    </form>
                )}

                <div className="reply_list">
                    <ul className="list-none p-0">
                        {communityReplies.map(reply => (
                            <li key={reply.grseq} className="border border-gray-300 rounded p-4 mb-4 bg-gray-100">
                                <div className="flex items-center mb-4">
                                    <div className="w-20 h-20 overflow-hidden rounded-full mr-9">
                                        {reply.saveImage ? (
                                            <img src={`images/${reply.saveImage}`} className="object-cover w-full h-full" alt="Reply"/>
                                        ) : (
                                            <img src="images/repl-noimg.png" className="object-cover w-full h-full" alt="No Image"/>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <span className="block font-bold mb-2">@ {reply.nickname}</span>
                                        <pre className="whitespace-pre-wrap">{reply.content}</pre>
                                    </div>
                                    <div className="text-right text-gray-500">
                                        <p className="text-sm">{reply.createdate}</p>
                                    </div>
                                </div>
                                {loginUser.userid === reply.userid && (
                                    <div className="mt-8">
                                        <form action="zootopia.do?command=updateCommunityReply" method="post">
                                            <input type="hidden" name="grseq" value={reply.grseq} />
                                            <input type="hidden" name="gseq" value={communityVO.gseq} />
                                            <textarea 
                                                name="content" 
                                                id={`edit-content-${reply.grseq}`} 
                                                className="w-full h-16 border border-gray-300 rounded mb-4"
                                            />
                                            <div className="flex justify-end space-x-2">
                                                <button 
                                                    className="bg-black text-white px-4 py-2 rounded cursor-pointer hover:bg-white hover:text-black" 
                                                    type="submit"
                                                >
                                                    수정 완료
                                                </button>
                                                <button 
                                                    className="bg-white text-black border border-black px-4 py-2 rounded cursor-pointer hover:bg-black hover:text-white"
                                                    onClick={() => deleteCommunityReply(reply.grseq, communityVO.gseq)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};

export default CommunityDetail;
