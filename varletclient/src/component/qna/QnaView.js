import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import { getCookie } from '../../util/cookieUtil'; // getCookie를 가져옵니다.

const RCommunityDetail = () => {
    const { rnum } = useParams();
    const [post, setPost] = useState({});
    const [replyAllcount, setReplyAllcount] = useState(0);
    const navigate = useNavigate();
    const [loginUser, setLoginUser] = useState(null);

    useEffect(() => {
        jaxios.get(`/api/rcommunity/rCommunityDetail/${rnum}`)
            .then((response) => {
                setPost(response.data.post);
                console.log(response.data.post);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [rnum]);

    const deleteCommunity = (rnum) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            jaxios.delete(`/api/rcommunity/deleteCommunity/${rnum}`)
                .then(() => {
                    navigate('/rcommunity');
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const deleteCommunityReply = (grseq, rnum) => {
        if (window.confirm('정말로 삭제하시겠습니까?')) {
            jaxios.delete(`/api/rcommunity/deleteReply/${grseq}`)
                .then(() => {
                    // 댓글 삭제 후 처리 로직
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    };

    const returnList = () => {
        if (window.confirm('목록으로 돌아가시겠습니까?')) {
            navigate('/rcommunity');  
        }
    };

    const rcommunityupdate = () => {
        // 수정 로직 구현
    };

    const maskedid = (userid) => {
        if (typeof userid === 'string') {
            if (userid.length > 2) {
                return userid.slice(0, 2) + '*'.repeat(userid.length - 2);
            }
            return '*'.repeat(userid.length); // userid가 2글자 이하인 경우 모든 문자를 별표로 대체
        }
        return '정보 없음'; // userid가 문자열이 아닌 경우
    };

    return (
        <section className="p-8 max-w-screen-xl mx-auto">
            <div className="flex justify-between items-center border-b border-gray-300 pb-6 mb-8">
                <div className="text w-full">
                    <div className="text-gray-500 font-bold mb-4 text-lg">No.{post.rnum}</div>
                    <div className="flex flex-col mb-8">
                        <div className="text-3xl font-bold pb-12">
                            {post.title}
                        </div>
                        <div className="text-3xl font-bold pb-12">
                            <span className='w-2/12 text-center'>{maskedid(post.userid)}</span>
                        </div>
                        <div className="flex space-x-6">
                            <span className='text-left'>
                                작성일:
                                {new Date(post.writedate).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).replace(/\./g, '.').replace(/\.$/, '')}
                            </span>
                            <span className='text-left'>
                                여행 시작일:
                                {new Date(post.startdate).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).replace(/\./g, '.').replace(/\.$/, '')}
                            </span>
                            <span className='text-left'>
                                여행 종료일:
                                {new Date(post.enddate).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                }).replace(/\./g, '.').replace(/\.$/, '')}
                            </span>
                            <div className="flex items-center text-gray-500 text-lg mb-4">
                                <div className="mr-6">조회수: {post.views}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='btns'>
                    
                        {
                        (post.userid == getCookie('user').userid)?(
                            <button className="bg-blue-700 text-white border border-black px-5 py-3 rounded cursor-pointer hover:bg-[#000080]"
                            onClick={deleteCommunity}>삭제</button>
                        ):(<></>)
                        }
                        {
                        (post.userid == getCookie('user').userid)?(
                            <button  className="bg-blue-700 text-white border border-black px-5 py-3 rounded cursor-pointer hover:bg-[#000080]"
                            onClick={rcommunityupdate}>수정</button>
                        ):(<></>)
                        }
                    <button 
                        className="bg-blue-700 text-white border border-black px-5 py-3 rounded cursor-pointer hover:bg-[#000080]"
                        onClick={returnList}
                    >
                        목록으로
                    </button>
                </div>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
                <div className="text-lg mb-15 leading-relaxed min-h-[40rem] w-[60rem]">
                    <pre className="whitespace-pre-wrap">{post.content}</pre>
                </div>
            </div>

            <div className="mt-16">
                <h2 className="text-2xl font-semibold border-t border-gray-300 pt-8 mb-8">댓글 {replyAllcount}개</h2>
                {loginUser && (
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
                                                <input type="hidden" name="rnum" value={rnum} />
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
                                                        onClick={() => deleteCommunityReply(reply.grseq, rnum)}
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
