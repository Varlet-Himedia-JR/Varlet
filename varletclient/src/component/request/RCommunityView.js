import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import jaxios from '../../util/jwtUtil';
import { location1Data, location2Data } from '../request/LocaionData';
import { setCookie, getCookie, removeCookie } from "../../util/cookieUtil";



function RCommunityView() {
  const { rnum } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({});
  const [showReplyForm, setShowReplyForm] = useState(false);
  const userCookie = getCookie('user');
  const [files, setFiles] = useState([]);
  const [content, setContent] = useState('');
  const [image, setImage] = useState([]);
  const [saveimages, setSaveImages] = useState([]);
  const [imgSrc, setImgSrc] = useState([]);
  const [removedFiles, setRemovedFiles] = useState([]);
  const [replies, setReplies] = useState([]); // 답글 목록 상태 추가
  const { rcnum } = useParams();

  useEffect(() => {
      // 게시물 데이터 가져오기
      jaxios.get(`/api/rcommunity/rCommunityView/${rnum}`)
          .then((response) => {
              setPost(response.data.post);
              console.log("post?", response.data.post)
          })
          .catch((err) => {
              console.error(err);
          });

      // 답글 목록 가져오기
      jaxios.get(`/api/rcrecommend/getReplies/${rnum}`)
          .then((response) => {
              setReplies(response.data.recommend); // 답글 리스트 상태 업데이트
              console.log("댓글정보?", response.data.recommend);
          })
          .catch((err) => {
              console.error(err);
          });
  }, [rnum]);

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

  const fetchReplies = () => {
    jaxios.get(`/api/rcrecommend/getReplies/${rnum}`)
      .then((response) => {
        setReplies(response.data.recommend);
      })
      .catch((err) => {
        console.error(err);
      });
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
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      })
          .then(response => {
            alert("답글 작성에 성공했습니다.");
            setShowReplyForm(false); // 답글 작성란을 숨김
            setShowReplyForm(false);
            setContent('');
            setFiles([]);
            setImage([]);
            setSaveImages([]);
            setImgSrc([]);
            setRemovedFiles([]);
            fetchReplies();
            
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
              .then(() => {
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
            return userid.slice(0, 2) + '*'.repeat(userid.length - 2);
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

  const replyUpdate = (grseq) => {
    // if (window.confirm('정말로 삭제하시겠습니까?')) {
    //     jaxios.delete(`/api/rcommunity/deleteReply/${grseq}`)
    //         .then(() => {
    //             // 댓글 삭제 후 처리 로직
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }
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

  const getTravelDuration = (startDate, endDate) => {
      if (!startDate || !endDate) return '정보 없음';

      const start = new Date(startDate);
      const end = new Date(endDate);

      const diffTime = end - start;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffNights = diffDays - 1;

      return `${diffNights}박 ${diffDays}일`;
  };

  const extractDate = (dateString) => {
      if (!dateString) return '';

      return dateString.slice(0, 10);
  };

  const writerecommend = () => {
      setShowReplyForm(!showReplyForm);
  };

  const [showDates, setShowDates] = useState(false);
  const toggleShowDates = () => {
      setShowDates(!showDates);
  };

  const [showLocation, setShowLocation] = useState(false);
  const toggleShowLocation = () => {
      setShowLocation(!showLocation);
  };

  const handlepicked = (replyId) => {
    jaxios.post(`/api/rcommunity/pick`, { rnum, rcnum: replyId })
      .then(response => {
        setPost(prevPost => ({ ...prevPost, picked: "Y" }));
        setReplies(prevReplies => prevReplies.map(reply =>
          reply.rcnum === replyId ? { ...reply, rpicked: "Y" } : { ...reply, rpicked: "N" }
          
        ));
        alert("답글이 채택되었습니다.");
      })
      .catch(error => {
        console.error("채택 처리 중 오류 발생:", error);
      });
  };


return (
      

  <div class="w-full max-w-6xl mx-auto px-4 py-9">
  <div class="border-b pb-4 mb-6">
    <div class="mr-4">
        
        <span className='text-left'>
          no.
          {post.rnum}
        </span>
      </div>
    <div class="flex justify-between items-center"> {/* 변경된 부분 */}
      <h1 class="text-3xl font-bold mb-2">{post.title}</h1>
      <div class="flex items-center"> {/* 설정 포인트와 아이콘을 그룹화 */}
        <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-moneybag" width="44" height="44" viewBox="0 0 24 24" stroke-width="1.5" stroke="#2c3e50" fill="none" stroke-linecap="round" stroke-linejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M9.5 3h5a1.5 1.5 0 0 1 1.5 1.5a3.5 3.5 0 0 1 -3.5 3.5h-1a3.5 3.5 0 0 1 -3.5 -3.5a1.5 1.5 0 0 1 1.5 -1.5z" />
            <path d="M4 17v-1a8 8 0 1 1 16 0v1a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" />
        </svg>
        <div className='text-2xl font-bold ml-2'> {/* 아이콘과 텍스트 사이에 간격 추가 */}
          설정 포인트: {post.reward}
        </div>
      </div>
    </div>

     <span className='w-2/12 text-center'>
        {post.picked === "Y" ? "채택 완료" : (post.picked === "N" ? "채택 진행중" : "미정")}
      </span>    <div class="flex items-center text-muted-foreground text-sm mt-4">
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
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
        {maskedid(post.userid)}
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
    <div className="bg-gray-100 p-8 rounded-lg mb-8">
      <div>
      <div>
      <div class="mr-4 text-2xl font-bold mb-2">
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
          여행 예상지:(클릭하여 확인)
        </span>
      </div>

      {showLocation && (
        <div className="text-xl">
          {getLocationName(post.location, post.location2)}
        </div>
      )}
    </div>
      </div>
      <div class="mr-4 text-2xl font-bold mb-2">
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
          class="w-5 h-5 mr-1 inline-block"
        >
          <path d="M8 2v4"></path>
          <path d="M16 2v4"></path>
          <rect width="18" height="18" x="3" y="4" rx="2"></rect>
          <path d="M3 10h18"></path>
        </svg>
        <span onClick={toggleShowDates} style={{ cursor: 'pointer' }}>
          상세 여행 일정:(클릭하여 확인)
        </span>
            </div>
      <div>
      {showDates && (
        <div className="text-xl">
          여행 시작일: {extractDate(post.startdate)} <br />
          여행 종료일: {extractDate(post.enddate)}  <br />
          총 여행 일수: {getTravelDuration(post.startdate, post.enddate)} 
        </div>
      )}
    </div>
      <div className="text-lg leading-relaxed min-h-[40rem] w-full">
        <pre className="whitespace-pre-wrap">{post.content}</pre>
      </div>
    </div>
  </div>

  <div class="border-t pt-6 mt-6">
    <div class="flex justify-end gap-2 mb-4">
      <div className="flex items-center gap-2">
        {(post.userid === getCookie('user').userid) && (
          <>
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"                   
            onClick={rcommunityupdate}>
              수정
            </button>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={() => deleteCommunity(post.rnum)}>
              삭제
            </button>
          </>
        )}
      </div>
      <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
        onClick={returnList}>
        목록으로
      </button>
      <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              onClick={test}>
              test
            </button>
    </div>

    <div 
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-lg p-4 bg-blue-50 text-blue-800 dark:bg-gray-800 dark:text-blue-400 rounded-lg shadow-lg cursor-pointer flex items-center justify-center space-x-3 hover:bg-blue-100 dark:hover:bg-gray-700 transition-colors duration-300"
      onClick={writerecommend}
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-blue-800 dark:text-blue-400" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
        <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
        <path d="M13.5 6.5l4 4" />
      </svg>
      <span className="text-xl font-bold flex items-center">
      {showReplyForm ? '답글 작성 닫기' : '답글 작성 열기'}
      </span>
    </div>

     {showReplyForm && (
                  <form onSubmit={handleSubmitRec} className="mt-6">
                      <textarea
                          rows="4"
                          placeholder="답글 내용을 입력하세요"
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded"
                      ></textarea>

                      <input
                      id="multiple_files"
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                      />
                      <label>파일 미리보기</label>

                      <div className="flex flex-wrap mt-4">
                          {files.map((fileObj, index) => (
                              <div key={index} className="relative">
                                  <img src={fileObj.src} alt="preview"                   
                                  style={{ width: '300px', height: '300px', objectFit: 'cover', border: '1px solid #ddd' }}
                                  />
                                  <button
                                      type="button"
                                      onClick={() => handleRemoveFile(fileObj.file)}
                                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded"
                                  >
                                      X
                                  </button>
                              </div>
                          ))}
                      </div>
        <button
          type="submit"
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          답글 작성
        </button>
      </form>
    )}
    <div class="space-y-4">
  {replies && replies.length > 0 ? (
    replies.map((reply, index) => (
      <div key={index} class="flex items-start gap-4">
        <span class="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
          <img class="aspect-square h-full w-full" alt="@user" src="/placeholder-user.jpg" />
        </span>
        <div class="grid gap-1.5">
          <div class="flex items-center gap-2 text-sm">
            <div class="font-medium">{maskeduser(reply.userid)}</div>
            <div class="text-muted-foreground">{new Date(reply.writedate).toLocaleDateString('ko-KR')}</div>
            <div className="flex items-center gap-2">
              {(post.userid === getCookie('user').userid) && (
                <>
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"                   
                  onClick={handlepicked}>
                    채택하기
                  </button>
                  
                </>
              )}
            </div>
          </div>
          <span className='w-2/12 text-center'>
        {reply.rpicked === "Y" ? "채택 완료" : (reply.rpicked === "N" ? "채택 진행중" : "미정")}
        
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
          <div class="flex justify-end gap-2 mb-4">
            <div className="flex items-center gap-2">
            {(reply.user === getCookie('user')?.user) && (
                <>
                  <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"                   
                  onClick={replyUpdate}>
                    수정
                  </button>
                  <button
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
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
</div>

    
  </div>
</div>

    );
  };
  
  export default RCommunityView;