  import React, { useEffect, useState } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import jaxios from '../../util/jwtUtil';
  import { getCookie } from '../../util/cookieUtil';
  import { location1Data, location2Data } from '../request/LocaionData';



    function RCommunityView ()  {
      const { rnum } = useParams();
      const [post, setPost] = useState({});
      const [replyAllcount, setReplyAllcount] = useState(0);
      const navigate = useNavigate();
      const [loginUser, setLoginUser] = useState(null);
      
    
      useEffect(() => {
        jaxios.get(`/api/rcommunity/rCommunityView/${rnum}`)
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
          jaxios.delete(`/api/rcommunity/rCommunityDelete/${rnum}`)
            .then(() => {
              navigate('/rcommunity');
            })
            .catch((err) => {
              console.error(err);
            });
        }
      };
    
      const deleteCommunityReply = (grseq) => {
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
        const diffNights = diffDays - 1; // 시작일과 종료일 포함
    
        return `${diffNights}박 ${diffDays}일`;
      };

      const extractDate = (dateString) => {
        if (!dateString) return '';
      
        // 문자열의 앞 10글자만 반환
        return dateString.slice(0, 10);
      };

      const writerecommend = () => {
        
      };
    
      const [showDates, setShowDates] = useState(false);

      const toggleShowDates = () => {
        setShowDates(!showDates);
      };

      const [showLocation, setShowLocation] = useState(false);

    const toggleShowLocation = () => {
      setShowLocation(!showLocation);
    };    


  return (
        

    <div class="w-full max-w-6xl mx-auto px-4 py-9">
    <div class="border-b pb-4 mb-6">
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

      <div class="flex items-center text-muted-foreground text-sm mt-4">
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
        <span className="text-xl font-bold flex items-center">답글 작성하기</span>
      </div>




      <div class="space-y-4">
        <div class="flex items-start gap-4">
          <span class="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
            <img class="aspect-square h-full w-full" alt="@shadcn" src="/placeholder-user.jpg" />
          </span>
          <div class="grid gap-1.5">
            <div class="flex items-center gap-2 text-sm">
              <div class="font-medium">Jane Doe</div>
              <div class="text-muted-foreground">2 days ago</div>
            </div>
            <p>
              Wow, your trip to Jeju Island sounds amazing! I've always wanted to visit and your photos and
              descriptions have made me even more excited to plan a trip there. The natural beauty and cultural
              richness of the island seem truly captivating.
            </p>
          </div>
        </div>
        <div class="flex items-start gap-4">
          <span class="relative flex shrink-0 overflow-hidden rounded-full w-10 h-10 border">
            <img class="aspect-square h-full w-full" alt="@shadcn" src="/placeholder-user.jpg" />
          </span>
          <div class="grid gap-1.5">
            <div class="flex items-center gap-2 text-sm">
              <div class="font-medium">Michael Johnson</div>
              <div class="text-muted-foreground">1 week ago</div>
            </div>
            <p>I've been to Jeju Island a few times</p>
          </div>
          
        </div>
      </div>
    </div>
  </div>

      );
    };
    
    export default RCommunityView;