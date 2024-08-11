import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import { getCookie } from '../../util/cookieUtil';

const location2Data = {
    1: [{ value: 0, label: "지역 선택" }],
    2: [
      { value: 0, label: "전체" },
      { value: 1, label: "강남구" },
      { value: 2, label: "강동구" },
      { value: 3, label: "강북구" },
      { value: 4, label: "강서구" },
      { value: 5, label: "관악구" },
      { value: 6, label: "광진구" },
      { value: 7, label: "구로구" },
      { value: 8, label: "금천구" },
      { value: 9, label: "노원구" },
      { value: 10, label: "도봉구" },
      { value: 11, label: "동대문구" },
      { value: 12, label: "동작구" },
      { value: 13, label: "마포구" },
      { value: 14, label: "서대문구" },
      { value: 15, label: "서초구" },
      { value: 16, label: "성동구" },
      { value: 17, label: "성북구" },
      { value: 18, label: "송파구" },
      { value: 19, label: "양천구" },
      { value: 20, label: "영등포구" },
      { value: 21, label: "용산구" },
      { value: 22, label: "은평구" },
      { value: 23, label: "종로구" },
      { value: 24, label: "중구" },
      { value: 25, label: "중랑구" }
    ],
    3: [
      { value: 0, label: "전체" },
      { value: 1, label: "중구" },
      { value: 2, label: "서구" },
      { value: 3, label: "동구" },
      { value: 4, label: "영도구" },
      { value: 5, label: "부산진구" },
      { value: 6, label: "동래구" },
      { value: 7, label: "남구" },
      { value: 8, label: "북구" },
      { value: 9, label: "강서구" },
      { value: 10, label: "해운대구" },
      { value: 11, label: "사하구" },
      { value: 12, label: "금정구" },
      { value: 13, label: "연제구" },
      { value: 14, label: "수영구" },
      { value: 15, label: "사상구" },
      { value: 16, label: "기장군" }
    ],
    4: [
      { value: 0, label: "전체" },
      { value: 1, label: "중구" },
      { value: 2, label: "동구" },
      { value: 3, label: "서구" },
      { value: 4, label: "남구" },
      { value: 5, label: "북구" },
      { value: 6, label: "수성구" },
      { value: 7, label: "달서구" },
      { value: 8, label: "달성군" },
      { value: 9, label: "군위군" }
    ],
    5: [
      { value: 0, label: "전체" },
      { value: 1, label: "중구" },
      { value: 2, label: "동구" },
      { value: 3, label: "미추홀구" },
      { value: 4, label: "연수구" },
      { value: 5, label: "남동구" },
      { value: 6, label: "부평구" },
      { value: 7, label: "계양구" },
      { value: 8, label: "서구" },
      { value: 9, label: "강화군" },
      { value: 10, label: "옹진군" }
    ],
    6: [
      { value: 1, label: "전체" },
      { value: 2, label: "동구" },
      { value: 3, label: "서구" },
      { value: 4, label: "남구" },
      { value: 5, label: "북구" },
      { value: 6, label: "광산구" }
    ],
    7: [
      { value: 1, label: "전체" },
      { value: 2, label: "동구" },
      { value: 3, label: "중구" },
      { value: 4, label: "서구" },
      { value: 5, label: "유성구" },
      { value: 6, label: "대덕구" }
    ],
    8: [
      { value: 1, label: "전체" },
      { value: 2, label: "중구" },
      { value: 3, label: "남구" },
      { value: 4, label: "동구" },
      { value: 5, label: "북구" },
      { value: 6, label: "울주군" }
    ],
    9: [
      { value: 1, label: "전체" },
      { value: 2, label: "조치원읍" },
      { value: 3, label: "연기면" },
      { value: 4, label: "연동면" },
      { value: 5, label: "부강면" },
      { value: 6, label: "금남면" },
      { value: 7, label: "장군면" },
      { value: 8, label: "연서면" },
      { value: 9, label: "전의면" },
      { value: 10, label: "전동면" },
      { value: 11, label: "소정면" },
      { value: 12, label: "한솔동" },
      { value: 13, label: "새롬동" },
      { value: 14, label: "나성동" },
      { value: 15, label: "도담동" },
      { value: 16, label: "어진동" },
      { value: 17, label: "해밀동" },
      { value: 18, label: "아름동" },
      { value: 19, label: "종촌동" },
      { value: 20, label: "고운동" },
      { value: 21, label: "소담동" },
      { value: 22, label: "반곡동" },
      { value: 23, label: "보람동" },
      { value: 24, label: "대평동" },
      { value: 25, label: "다정동" }
    ],
    10: [
      { value: 1, label: "전체" },
      { value: 2, label: "수원시" },
      { value: 3, label: "성남시" },
      { value: 4, label: "의정부시" },
      { value: 5, label: "안양시" },
      { value: 6, label: "부천시" },
      { value: 7, label: "광명시" },
      { value: 8, label: "평택시" },
      { value: 9, label: "동두천시" },
      { value: 10, label: "안산시" },
      { value: 11, label: "고양시" },
      { value: 12, label: "과천시" },
      { value: 13, label: "구리시" },
      { value: 14, label: "남양주시" },
      { value: 15, label: "오산시" },
      { value: 16, label: "시흥시" },
      { value: 17, label: "군포시" },
      { value: 18, label: "의왕시" },
      { value: 19, label: "하남시" },
      { value: 20, label: "용인시" },
      { value: 21, label: "파주시" },
      { value: 22, label: "이천시" },
      { value: 23, label: "안성시" },
      { value: 24, label: "김포시" },
      { value: 25, label: "화성시" },
      { value: 26, label: "광주시" },
      { value: 27, label: "양주시" },
      { value: 28, label: "포천시" },
      { value: 29, label: "여주시" },
      { value: 30, label: "연천군" },
      { value: 31, label: "가평군" },
      { value: 32, label: "양평군" }
    ],
    11: [
      { value: 1, label: "전체" },
      { value: 2, label: "춘천" },
      { value: 3, label: "원주" },
      { value: 4, label: "강릉" },
      { value: 5, label: "동해" },
      { value: 6, label: "태백" },
      { value: 7, label: "속초" },
      { value: 8, label: "삼척" },
      { value: 9, label: "홍천" },
      { value: 10, label: "영월" },
      { value: 11, label: "평창" },
      { value: 12, label: "정선" },
      { value: 13, label: "철원" },
      { value: 14, label: "화천" },
      { value: 15, label: "양구" },
      { value: 16, label: "인제" },
      { value: 17, label: "고성" },
      { value: 18, label: "양양" }
    ],
    12: [
      { value: 1, label: "전체" },
      { value: 2, label: "청주" },
      { value: 3, label: "충주" },
      { value: 4, label: "제천" },
      { value: 5, label: "보은" },
      { value: 6, label: "옥천" },
      { value: 7, label: "영동" },
      { value: 8, label: "증평" },
      { value: 9, label: "진천" },
      { value: 10, label: "괴산" },
      { value: 11, label: "음성" },
      { value: 12, label: "단양" }
    ],
    13: [
      { value: 1, label: "전체" },
      { value: 2, label: "천안" },
      { value: 3, label: "공주" },
      { value: 4, label: "보령" },
      { value: 5, label: "아산" },
      { value: 6, label: "서산" },
      { value: 7, label: "논산" },
      { value: 8, label: "계룡" },
      { value: 9, label: "당진" },
      { value: 10, label: "금산" },
      { value: 11, label: "부여" },
      { value: 12, label: "서천" },
      { value: 13, label: "청양" },
      { value: 14, label: "홍성" },
      { value: 15, label: "예산" },
      { value: 16, label: "태안" }
    ],
    14: [
      { value: 1, label: "전체" },
      { value: 2, label: "전주" },
      { value: 3, label: "익산" },
      { value: 4, label: "군산" },
      { value: 5, label: "정읍" },
      { value: 6, label: "남원" },
      { value: 7, label: "김제" },
      { value: 8, label: "무주" },
      { value: 9, label: "완주" },
      { value: 10, label: "부안" },
      { value: 11, label: "고창" },
      { value: 12, label: "임실" },
      { value: 13, label: "순창" },
      { value: 14, label: "진안" },
      { value: 15, label: "장수" }
    ],
    15: [
      { value: 1, label: "전체" },
      { value: 2, label: "목포" },
      { value: 3, label: "여수" },
      { value: 4, label: "순천" },
      { value: 5, label: "나주" },
      { value: 6, label: "광양" },
      { value: 7, label: "담양" },
      { value: 8, label: "곡성" },
      { value: 9, label: "구례" },
      { value: 10, label: "고흥" },
      { value: 11, label: "보성" },
      { value: 12, label: "화순" },
      { value: 13, label: "장흥" },
      { value: 14, label: "강진" },
      { value: 15, label: "해남" },
      { value: 16, label: "영암" },
      { value: 17, label: "무안" },
      { value: 18, label: "함평" },
      { value: 19, label: "영광" },
      { value: 20, label: "장성" },
      { value: 21, label: "완도" },
      { value: 22, label: "진도" },
      { value: 23, label: "신안" }
    ],
    16: [
      { value: 1, label: "전체" },
      { value: 2, label: "포항" },
      { value: 3, label: "경주" },
      { value: 4, label: "김천" },
      { value: 5, label: "안동" },
      { value: 6, label: "구미" },
      { value: 7, label: "영주" },
      { value: 8, label: "영천" },
      { value: 9, label: "상주" },
      { value: 10, label: "문경" },
      { value: 11, label: "경산" },
      { value: 12, label: "의성" },
      { value: 13, label: "청송" },
      { value: 14, label: "영양" },
      { value: 15, label: "영덕" },
      { value: 16, label: "청도" },
      { value: 17, label: "고령" },
      { value: 18, label: "성주" },
      { value: 19, label: "칠곡" },
      { value: 20, label: "예천" },
      { value: 21, label: "봉화" },
      { value: 22, label: "울진" },
      { value: 23, label: "울릉" }
    ],
    17: [
      { value: 1, label: "전체" },
      { value: 2, label: "창원" },
      { value: 3, label: "김해" },
      { value: 4, label: "양산" },
      { value: 5, label: "진주" },
      { value: 6, label: "거제" },
      { value: 7, label: "통영" },
      { value: 8, label: "사천" },
      { value: 9, label: "밀양" },
      { value: 10, label: "함안" },
      { value: 11, label: "거창" },
      { value: 12, label: "창녕" },
      { value: 13, label: "고성" },
      { value: 14, label: "하동" },
      { value: 15, label: "합천" },
      { value: 16, label: "남해" },
      { value: 17, label: "함양" },
      { value: 18, label: "신창" },
      { value: 19, label: "의령" }
    ],
    18: [
      { value: 1, label: "전체" },
      { value: 2, label: "제주도" },
      { value: 3, label: "서귀포시" }
    ]
  };
  
  
  const location1Data = {
    1: ["지역 선택"],
    2: ["서울특별시"],
    3: ["부산광역시"],
    4: ["대구광역시"],
    5: ["인천광역시"],
    6: ["광주광역시"],
    7: ["대전광역시"],
    8: ["울산광역시"],
    9: ["세종특별자치시"],
    10: ["경기도"],
    11: ["강원도"],
    12: ["충청북도"],
    13: ["충청남도"],
    14: ["전라북도"],
    15: ["전라남도"],
    16: ["경상북도"],
    17: ["경상남도"],
    18: ["제주도"]
  };

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
            return '*'.repeat(userid.length);
        }
        return '정보 없음';
    };

    const getLocationName = (location1, location2) => {
        const location1Name = location1Data[location1] ? location1Data[location1][0] : '정보 없음';
        const location2Options = location2Data[location1] || [];
        const location2Name = location2Options.find(option => option.value === location2)?.label || '정보 없음';

        return `${location1Name} - ${location2Name}`;
    };

    return (
        <section className="p-8 max-w-screen-lg ">
            <div className=" flex-col border-b border-gray-300 pb-6 mb-8">
                <div className="text-gray-500 font-bold mb-4 text-lg">No.{post.rnum}</div>
                <div className="flex flex-col mb-8">
                    <div className="text-3xl font-bold pb-12">
                        {post.title}
                    </div>
                    <div className="flex items-center justify-between mb-8">
                        <div className="text-3xl font-bold">
                            <span className='w-2/12 text-center'>{maskedid(post.userid)}</span>
                        </div>
                        <div className="flex space-x-4">
                            {
                            (post.userid === getCookie('user').userid) && (
                                <>
                                    <button 
                                        className="bg-blue-700 text-white border border-black px-5 py-3 rounded cursor-pointer hover:bg-[#000080]"
                                        onClick={rcommunityupdate}
                                    >
                                        수정
                                    </button>
                                    <button 
                                        className="bg-blue-700 text-white border border-black px-5 py-3 rounded cursor-pointer hover:bg-[#000080]"
                                        onClick={() => deleteCommunity(post.rnum)} 
                                    >
                                        삭제
                                    </button>
                                </>
                            )
                            }
                        </div>
                    </div>
                    <div className="flex space-x-6 mb-6">
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
                <div className="text-3xl font-bold pb-12">
                    여행 예상지: {getLocationName(post.location, post.location2)}
                </div>

                <div className="bg-gray-100 p-8  rounded-lg mb-8">
                    <div className="text-lg leading-relaxed min-h-[40rem] w-full">
                        <pre className="whitespace-pre-wrap">{post.content}</pre>
                    </div>
                </div>

                <button 
                    className="bg-blue-700 text-white border border-black px-5 py-3 rounded cursor-pointer hover:bg-[#000080] mb-8"
                    onClick={returnList}
                >
                    목록으로
                </button>

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
                                {communityReplyList.map((reply) => (
                                    <li key={reply.grseq} className="border-b border-gray-300 py-4">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-gray-700 font-semibold">
                                                {reply.userid}
                                            </span>
                                            <span className="text-gray-500 text-sm">
                                                {new Date(reply.writedate).toLocaleDateString('ko-KR', {
                                                    year: 'numeric',
                                                    month: '2-digit',
                                                    day: '2-digit'
                                                }).replace(/\./g, '.').replace(/\.$/, '')}
                                            </span>
                                        </div>
                                        <div className="text-gray-800 mb-2">
                                            {reply.content}
                                        </div>
                                        {loginUser && loginUser.userid === reply.userid && (
                                            <div className="flex space-x-4">
                                                <button 
                                                    className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-[#000080]"
                                                    onClick={() => deleteCommunityReply(reply.grseq, post.rnum)}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    */}
                </div>
            </div>
        </section>
    );
};

export default RCommunityDetail;