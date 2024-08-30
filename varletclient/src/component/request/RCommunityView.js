import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import { location1Data, location2Data } from '../request/LocaionData';
import { setCookie, getCookie } from "../../util/cookieUtil";
import Footer from '../headerfooter/Footer';
import Heading from '../headerfooter/Heading';

import { useInView } from "react-intersection-observer";



function RCommunityView() {
  const { rnum } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [ setImage] = useState([]);
  const [saveimages, setSaveImages] = useState([]);
  const [setImgSrc] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [replies, setReplies] = useState([]); 
  const replyFormRef = useRef(null);
  // 상태 변수 선언
  const [userCookie, setUserCookie] = useState(getCookie('user'));
  const [size] = useState(5); // 한 번에 가져올 답글 수
  const [page, setPage] = useState(1); // 현재 페이지 상태 추가
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [setTotalReplies] = useState(0); // 전체 답글 수


  // const [ref, inView] = useInView({
  //   threshold: 50  
  // });








  // 쿠키가 업데이트될 때마다 userCookie 상태를 갱신
  useEffect(() => {
    const updatedUser = getCookie('user');
    setUserCookie(updatedUser);
  }, []); // 초기 로딩 시 한 번 실행


  useEffect(() => {
      // 게시물 데이터 가져오기
      jaxios.get(`/api/rcommunity/rCommunityView/${rnum}`)
          .then((response) => {
              setPost(response.data.post);
              console.log("post?", response.data.post)
              console.log("쿠키데이터확인",userCookie)
              console.log("쿠키데이터확인",userCookie.userid)
              console.log("포스트 유저", post.userid)
          })
          .catch((err) => {
              console.error(err);
          });

  }, [rnum]);

  const fetchReplies = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);

    jaxios.get(`/api/rcrecommend/getReplies/${rnum}`, {
        params: { page, size },
    })
    .then(response => {
        const newReplies = response.data.recommend;
        const totalReplyCount = response.data.paging.totalCount;

        // 총 답글 수를 설정합니다.
        setTotalReplies(totalReplyCount);

        // 답글 목록에 새 답글을 추가합니다.
        setReplies(prevReplies => {
            const updatedReplies = [...prevReplies, ...newReplies];
            // 이미 불러온 답글 수가 총 답글 수와 같거나 많으면 더 이상 호출하지 않음.
            setHasMore(updatedReplies.length < totalReplyCount);
            return updatedReplies;
        });

        // 페이지 수를 증가시킵니다.
        setPage(prevPage => prevPage + 1);
    })
    .catch(err => {
        console.error('Error fetching replies:', err);
    })
    .finally(() => {
        setLoading(false);
    });
}, [page, size, hasMore, rnum, loading]);


    // 초기 데이터 로드 및 페이지 증가 처리
    useEffect(() => {
        setPage(1);  // rnum 변경 시 페이지 초기화
        setReplies([]);  // rnum 변경 시 기존 답글 초기화
        setHasMore(true); // rnum 변경 시 hasMore 초기화
        fetchReplies();
    }, [rnum]);


    // 무한 스크롤 이벤트 핸들러
    useEffect(() => {
      const handleScroll = () => {
          if (
              window.innerHeight + document.documentElement.scrollTop
              >= document.documentElement.offsetHeight - 200
              && hasMore
              && !loading
          ) {
              fetchReplies();
          }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);


  const handleFileChange = (event) => {
      const selectedFiles = Array.from(event.target.files);
      const filePreviews = selectedFiles.map(file => ({
          file,
          src: URL.createObjectURL(file)
      }));
      setFiles(filePreviews);

      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('image', file));

      jaxios.post('/api/rcrecommend/fileup', formData)
          .then((result) => {
              const { image, savefilenames } = result.data;
              setImage(result.data.image);
              setSaveImages(result.data.savefilenames);
              setImgSrc(savefilenames.map(filename => `http://localhost:8070/uploads/${filename}`));
          })
          .catch((err) => {
              console.error(err);
          });
  };

  const replyUpdate = ()=>{

  }

  const writerecommend = (rnum) => {
    navigate(`/rCommunityView/${rnum}/rcRecommend`);
};

  const handleSubmitRec = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userid', userCookie.userid);
    formData.append('content', content);

    saveimages.forEach((filename) => {
        formData.append('saveimages', filename);
    });

    removedFiles.forEach((filename) => {
        formData.append('removedimages', filename);
    });

    jaxios.post(`/api/rcrecommend/writeRecommend/${rnum}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(response => {
        alert("답글 작성에 성공했습니다.");
        setShowReplyForm(false); // 답글 작성란을 숨김
        setContent('');
        setFiles([]);
        setImage([]);
        setSaveImages([]);
        setImgSrc([]);
        setRemovedFiles([]);
        
        // 페이지를 새로 고칩니다.
        window.location.reload();
    })
    .catch(error => {
        alert('답글 작성에 실패했습니다.');
        console.error(error);
    });
};



  const handleRemoveFile = (fileToRemove) => {
      setFiles(prevFiles => prevFiles.filter(file => file.file !== fileToRemove));
      setRemovedFiles(prevRemoved => [...prevRemoved, fileToRemove.name]); // 삭제된 파일 이름을 추가
  };



    const deleteCommunity = (rnum) => {
      if (window.confirm('정말로 삭제하시겠습니까?')) {
        jaxios.delete(`/api/rcommunity/rCommunityDelete/${rnum}`)
          .then((response) => {
            // 서버 응답에서 업데이트된 포인트 값 받기

            // 쿠키 업데이트
            setCookie('user', { ...userCookie, point: response.data.point});


            // 업데이트된 포인트를 로그에 출력
            console.log("삭제 후 업데이트된 dbwj:", userCookie);

            // 페이지 이동
            navigate('/rcommunity');
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };


  const maskeduser = (user) => {
    // user는 객체로 되어 있어야 함
    if (user && typeof user.userid === 'string') {
        const userid = user.userid;
        if (userid.length > 2) {
            return userid.slice(0, 2) + '*'.repeat(3);
        }
        return '*'.repeat(userid.length);
    }
    return '정보 없음';
  };


const replyDelete = (rcnum) => {
  if (window.confirm('정말로 삭제하시겠습니까?')) {
      jaxios.delete(`/api/rcrecommend/deleteReply/${rcnum}`)
          .then(() => {
              // 삭제 후, 답글 목록을 새로 가져와서 업데이트합니다.
              fetchReplies();
              alert("답글이 삭제되었습니다.");
          })
          .catch((err) => {
              console.error(err);
              alert('답글 삭제에 실패했습니다.');
          });
  }
};


  const returnList = () => {
      if (window.confirm('목록으로 돌아가시겠습니까?')) {
          navigate('/rcommunity');
      }
  };


  const test = () =>{
    navigate('/rCommunityDetail/:rnum/rcCommunityWrite')
  };

  const rcommunityupdate = () => {
      navigate(`/rCommunityUpdate/${rnum}`);
      
  };

  const getLocationName = (location1, location2) => {
      const location1Name = location1Data[location1] ? location1Data[location1][0] : '정보 없음';
      const location2Options = location2Data[location1] || [];
      const location2Name = location2Options.find(option => option.value === location2)?.label || '정보 없음';

      return `${location1Name} - ${location2Name}`;
  };

/**
 * 주어진 시작일과 종료일 사이의 여행 기간을 계산하는 함수
 * @param {string} startDate - 여행 시작일을 나타내는 문자열 (예: '2024-08-01')
 * @param {string} endDate - 여행 종료일을 나타내는 문자열 (예: '2024-08-05')
 * @returns {string} - 여행 기간 (예: '2박 3일')
 */
const getTravelDuration = (startDate, endDate) => {
  // 시작일 또는 종료일이 제공되지 않은 경우 '정보 없음' 반환
  if (!startDate || !endDate) return '정보 없음';

  // Date 객체로 변환
  const start = new Date(startDate);
  const end = new Date(endDate);

  // 종료일이 시작일보다 이전일 경우 잘못된 입력으로 간주
  if (end < start) return '잘못된 날짜 범위';

  // 두 날짜 사이의 시간 차이 계산
  const diffTime = end - start;
  // 밀리초를 일로 변환
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 'n박 n일' 형식으로 변환
  const diffNights = diffDays - 1;

  // 여행 기간 문자열 반환
  return `${diffNights + 1}박 ${diffDays + 1}일`;
};

  const extractDate = (dateString) => {
      if (!dateString) return '';

      return dateString.slice(0, 10);
  };

//   const writerecommend = () => {
//     setShowReplyForm(prev => !prev);
//     if (!showReplyForm) {
//         // 답글 작성 폼이 열릴 때 스크롤 이동
//         setTimeout(() => {
//             if (replyFormRef.current) {
//                 replyFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
//             }
//         }, 0);
//     } 
// };

  const [showDates, setShowDates] = useState(false);
  const toggleShowDates = () => {
      setShowDates(!showDates);
  };

  const [showLocation, setShowLocation] = useState(false);
  const toggleShowLocation = () => {
      setShowLocation(!showLocation);
  };

  const handlepicked = (rcnum) => {
    // 채택 전에 확인 메시지 표시
    const isConfirmed = window.confirm("채택은 번복이 불가능합니다. 진행하시겠습니까?");
    
    if (isConfirmed) {
      // 사용자가 확인을 누른 경우
      // 1. 선택된 답글의 rpicked를 'Y'로 변경
      jaxios.post(`/api/rcrecommend/updateReplyPicked/${rcnum}`, { rpicked: 'Y' })
        .then(() => {
          // 2. 게시글의 picked를 'Y'로 변경
          jaxios.post(`/api/rcommunity/updatePicked/${post.rnum}`, { picked: 'Y' })
            .then(() => {
              alert('채택이 완료되었습니다.');
              fetchReplies(); // 업데이트된 답글 목록을 가져옵니다.
              setPost(prevPost => ({ ...prevPost, picked: 'Y' })); // 로컬 상태 업데이트
              console.log("userpoint", userCookie.point)
            })
            .catch((err) => {
              console.error('게시글 상태 업데이트 실패:', err);
              alert('게시글 채택 업데이트에 실패했습니다.');
            });
        })
        .catch((err) => {
          console.error('답글 상태 업데이트 실패:', err);
          alert('답글 채택 업데이트에 실패했습니다.');
        });
    } else {
      // 사용자가 취소를 누른 경우
      // 여기서는 아무 작업도 하지 않고 그냥 게시글 상세화면으로 돌아갑니다.
      // 필요한 경우 추가적으로 다른 로직을 작성할 수 있습니다.
    }
  };
  
  


return (
  <>
    <Heading />

        <div className='w-full max-w-[1500px] mx-auto px-1  min-h-screen'>
        <div className="bg-white bg-opacity-90 p-8  shadow-lg  min-h-screen mt-[80px]">
    <div className='mt-4 mb-5'>
      <div class="mr-4"> 
        <span className='text-left'>
          no.
          {post.rnum}
        </span>
      </div>
      <div class="flex justify-between items-center"> {/* 변경된 부분 */}
          <h1 class="text-3xl font-bold mb-2">{post.title}</h1>
          <div class="flex justify-between items-center"> {/* 변경된 부분 */}
            {post.picked === "Y" ? (
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#1e90ff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                  <path d="M9 12l2 2l4 -4" />
                </svg>
                <div class="text-2xl font-bold ml-2">채택 완료</div>
              </div>
            ) : (
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moneybag" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z" />
                  <path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
                </svg>
                <div class="text-2xl font-bold ml-2">설정 포인트: {post.reward}</div>
              </div>
            )}
          </div>
      </div>
      <div class="flex items-center text-muted-foreground text-sm mt-4">
        <div className="mr-4 flex items-center space-x-2">
          <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
              <img
                className="aspect-square h-full w-full object-cover"
                alt={`Profile of ${post.userid}`}
                src={post?.userid?.profileimg || '/placeholder-user.jpg'} // profileImage가 유저 객체에 있어야 합니다.
              />    
          </span>
          <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold">{maskeduser(post.userid)}</p>
          </div>
        </div>
        <div class="mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4 mr-1 inline-block"
          >
            <path d="M8 2v4"></path>
            <path d="M16 2v4"></path>
            <rect width="18" height="18" x="3" y="4" rx="2"></rect>
            <path d="M3 10h18"></path>
          </svg>
          <span className='text-left'>
            작성일:
            {new Date(post.writedate).toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }).replace(/\./g, '.').replace(/\.$/, '')}
          </span>
        </div>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="w-4 h-4 mr-1 inline-block"
          >
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
            <circle cx="12" cy="12" r="3"></circle>
          </svg>
          {post.views}
        </div>
      </div>
    </div>

  <div class="prose prose-lg">
    <div className="bg-gray-200 p-8 rounded-lg mb-8 opacity-90">
      <div className="  justify-center items-center space-x-8">
      <div className="flex flex-col space-y-4">
  {/* 여행 예상지 */}
  <div className="flex items-start space-x-2">
    <div className="flex-shrink-0">
      <div className="text-2xl font-bold mb-2">
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
          className="w-5 h-5 mr-1 inline-block"
        >
          <path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path>
          <path d="M15 5.764v15"></path>
          <path d="M9 3.236v15"></path>
        </svg>
        <span onClick={toggleShowLocation} style={{ cursor: 'pointer' }}>
          여행 예상지
        </span>
      </div>
      {showLocation && (
        <div className="text-xl mt-2">
          {getLocationName(post.location, post.location2)}
        </div>
      )}
    </div>
  </div>

  {/* 상세 여행 일정 */}
  <div className="flex items-start space-x-2">
    <div className="flex-shrink-0">
      <div className="text-2xl font-bold mb-2">
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
          className="w-5 h-5 mr-1 inline-block"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
        <span onClick={toggleShowDates} style={{ cursor: 'pointer' }}>
          상세 여행 일정
        </span>
      </div>
      {showDates && (
        <div className="text-xl mt-2">
          여행 시작일: {extractDate(post.startdate)} <br />
          여행 종료일: {extractDate(post.enddate)} <br />
          총 여행 일수: {getTravelDuration(post.startdate, post.enddate)}
        </div>
      )}
    </div>
  </div>
</div>

      </div>


      <div className="text-lg leading-relaxed min-h-[20rem] w-full">
        <pre className="whitespace-pre-wrap">{post.content}</pre>
      </div>
    </div>
  </div>
  <div class="border-t pt-6 mt-6">
    <div class="flex justify-end gap-2 mb-4">
      <div className="flex items-center gap-2">
        {(post?.userid?.userid === userCookie.userid) && (
          <>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"                   
            onClick={rcommunityupdate}>
              수정
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"
              onClick={() => deleteCommunity(post.rnum)}>
              삭제
            </button>

          </>
        )}
      </div>
      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"
        onClick={returnList}>
        목록으로
      </button>
    </div>
    <div 
    className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-[101][] w-full max-w-lg p-4 bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400 rounded-lg shadow-lg cursor-pointer flex items-center justify-center space-x-3 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors duration-300 z-[200]"
    onClick={() => writerecommend(rnum)}  // `rnum`을 적절히 전달
>
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-800 dark:text-blue-400" viewBox="0 0 24 24" strokeWidth="1.5"    stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
        <path d="M13.5 6.5l4 4" />
      </svg>
      <span className="text-xl font-bold flex items-center hover:bg-green   ">
      {showReplyForm ? '답글 작성 닫기' : '답글 작성 열기'}
      </span>
    </div>

         <div className="space-y-4">
           <div>
                {replies && replies.length > 0 ? (
                    replies.map((reply, index) => (
                        <div key={index} className="flex items-start gap-4">
                            <span className="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
                                <img
                                    className="aspect-square h-full w-full object-cover"
                                    alt={`Profile of ${reply.userid}`}
                                    src={reply.userid.profileimg || '/placeholder-user.jpg'}
                                />
                            </span>
                            <div className="grid gap-1.5">
                                <div className="flex items-center gap-2 text-sm">
                                    <div className="font-medium">{maskeduser(reply.userid)}</div>
                                    <div className="text-muted-foreground">{new Date(reply.writedate).toLocaleDateString('ko-KR')}</div>
                                    <div className="flex items-center gap-2">
                                        {(post?.userid?.userid === userCookie.userid && post.picked === 'N') && (
                                            <>
                                                <button 
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"                   
                                                    onClick={() => handlepicked(reply.rcnum)}>
                                                    채택하기
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <span className="w-2/12 text-center text-nowrap flex items-center justify-center gap-2">
                                    {post.picked === "Y" ? (
                                        reply.rpicked === "Y" ? (
                                            <>
                                                채택
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-circle-check" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#1e90ff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                                                    <path d="M9 12l2 2l4 -4" />
                                                </svg>
                                            </>
                                        ) : (
                                            "미채택"
                                        )
                                    ) : (
                                        reply.rpicked === "N" ? "채택 진행중" : "미정"
                                    )}
                                </span>
                                <p>{reply.content}</p>
                                <div className="flex flex-wrap mt-4">
                                    {reply.images && reply.images.length > 0 && (
                                        <div className="flex flex-wrap gap-4">
                                            {reply.images.map((image) => (
                                                <div key={image.id} className="w-64 h-64 overflow-hidden">
                                                    <img
                                                        src={`/api/${image.filePath}`} 
                                                        alt={image.imag_name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>  
                                <div className="flex justify-end gap-2 mb-4">
                                    <div className="flex items-center gap-2">
                                        {(reply.user === getCookie('user')?.user) && (
                                            <>
                                                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"                   
                                                    onClick={replyUpdate}>
                                                    수정
                                                </button>
                                                <button
                                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 hover:bg-blue-100 dark:hover:bg-gray-700"
                                                    onClick={() => replyDelete(reply.rcnum)}>
                                                    삭제
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>답글이 없습니다.</p>
                )}
                {loading && <p>Loading...</p>}
            </div>
        </div>
        </div>
</div>
</div>
<Footer/>

</>
    );
  };
  
  export default RCommunityView;
