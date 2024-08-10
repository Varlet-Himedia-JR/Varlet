import React from 'react';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';

const RCommunityDetail = () => {
    const { rnum } = useParams();
    const [post, setPost] = useState({});
    const [communityReplies, setCommunityReplies] = useState([]);
    const [replyAllcount, setReplyAllcount] = useState(0);
    const [loginUser, setLoginUser] = useState({ userid: null });
    const navigate = useNavigate();

    const [recommends, setRecommends] = useState(0);

    useEffect(() => {
        jaxios.get(`/api/rcommunity/rCommunityDetail/${rnum}`)
          .then((response) => {
            setPost(response.data.post); 
          })
          .catch((err) => {
            console.error(err);
          })
      }, [rnum]); 

    const deleteCommunity = (rnum) => {
        // 삭제 로직 구현
    };

    const deleteCommunityReply = (grseq, rnum) => {
        // 댓글 삭제 로직 구현
    };

    const returnList = () => {
        if (window.confirm('목록으로 돌아가시겠습니까?')) {
            navigate('/rcommunity');  
        }
    };

    const rCommumityUpdate = () => {};

    return (
        <section className="p-8 max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center border-b border-gray-300 pb-6 mb-8">
                <div className="text w-full">
                    <div className="text-gray-500 font-bold mb-4 text-lg">No.{post.rnum}</div>
                    <div className="flex flex-col mb-8">
                        <div className="text-3xl font-bold pb-12">
                            {post.title}
                        </div>
                        <div className="flex items-center text-gray-500 text-lg">
                            <div className="mr-6" >조회수: {post.views}</div>
                        </div>
                    </div>
                </div>
                <div>
                    {loginUser.userid && (
                        post.userid === loginUser.userid && (
                            <div className="flex space-x-6 mt-2">
                                <button 
                                    className="bg-gray-200 text-black border border-black px-5 py-3 rounded cursor-pointer hover:bg-black hover:text-white"
                                    onClick={() => rCommumityUpdate()}
                                >
                                    수정
                                </button>
                                <button 
                                    className="bg-black text-white border border-black px-5 py-3 rounded cursor-pointer hover:bg-white hover:text-black"
                                    onClick={() => deleteCommunity(post.rnum)}
                                >
                                    삭제
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
                
                <div className="text-lg mb-15 leading-relaxed min-h-[40rem] w-[60rem]">
                    <pre className="whitespace-pre-wrap">{post.content}</pre>
                </div>
                <div className="flex space-x-8">
                    <div class="inline-flex rounded-md shadow-sm">

                        <button type="button"   onClick={returnList} class="text-white bg-blue-700 hover:bg-[#000080] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-[#000080] focus:outline-none dark:focus:ring-blue-800">
                        목록으로
                        </button>
                    </div>  
                </div>
            </div>


            <div className="mt-16">
                <h2 className="text-2xl font-semibold border-t border-gray-300 pt-8 mb-8">댓글 {replyAllcount}개</h2>
                {loginUser.userid && (
                    <form className="flex flex-col mb-8" action="zootopia.do?command=writeCommunityReply" method="post">
                        <textarea 
                            className="w-full h-32 p-4 border border-gray-300 rounded mb-4" 
                            name="content" 
                            required
                        />
                        <input type="hidden" name="rnum" value={post.rnum} />
                        <button 
                            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-white hover:text-black" 
                            type="submit"
                        >
                            작성하기
                        </button>
                    </form>
                )}

                {/* 댓글 리스트를 표시할 때, UI가 복잡해지지 않도록 아래 코드는 비활성화 상태로 두었습니다.
                    주석을 제거하고 필요에 따라 스타일을 조정하여 사용할 수 있습니다.

                    <div className="reply_list">
                        <ul className="list-none p-0">
                            {communityReplies.map(reply => (
                                <li key={reply.grseq} className="border border-gray-300 rounded p-4 mb-4 bg-gray-100">
                                    <div className="flex items-center mb-4">
                                        <div className="flex-1">
                                            <span className="block font-bold mb-2">@ {reply.userid}</span>
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
                                                <input type="hidden" name="rnum" value={rCommunityDetail.rnum} />
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
                                                        onClick={() => deleteCommunityReply(reply.grseq, rCommunityDetail.rnum)}
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
                */}
            </div>
        </section>
    );
};

export default RCommunityDetail;
