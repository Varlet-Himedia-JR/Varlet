import { Routes, Route } from "react-router-dom";

import Main from './component/Main';
import Login from "./component/member/Login";
import ReviewList from "./component/review/ReviewList";
import WriteReview from "./component/review/WriteReview";
import ReviewView from "./component/review/ReviewView";
import Qna from "./component/qna/Qna";
import RCommunityList from "./component/request/RCommunityList";
import RPostWrite from "./component/request/RPostWrite";
import RCommunityView from "./component/request/RCommunityView";
import RCommunityUpdate from "./component/request/RCommunityUpdate";
import Join from './component/member/Join';
import WriteQna from './component/qna/WriteQna';
import QnaView from './component/qna/QnaView';
import Mycourse from "./component/course/Mycourse";
import Kakaosaveinfo from "./component/member/Kakaosaveinfo";
import Naversaveinfo from "./component/member/Naversaveinfo";
import Contents from "./component/contents/Contents";
import ContentsList from "./component/contents/ContentsList";
import Testcontents from "./component/contents/Testcontents";
import ContentsView from "./component/contents/ContentsView";
import MyPage from "./component/member/MyPage";
import MyInfo from "./component/member/MyInfo";
import MyReview from "./component/member/MyReview";
import MyQna from "./component/member/MyQna";
import MyRequest from "./component/member/MyRequest";
import Notice from "./component/notice/Notice";
import FindId from "./component/member/FindId";
import House from "./component/house/House";

import 'ckeditor5/ckeditor5.css';
import ContentsWrite from "./component/contents/ContentsWrite";

// import WritePost from './component/post/WritePost';
// import MyPage from './component/member/MyPage';
// import Kakaosaveinfo from './component/member/Kakaosaveinfo';
// import EditProfile from './component/member/EditProfile';
// import MemberPage from './component/member/MemberPage';
// import Postone from './component/post/Postone';

function App() {
  return (
    <div className="App" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Routes>
        <Route path="/" element={<Main />} />
        {/* 회원 관리 */}
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/kakaosaveinfo/:nickname" element={<Kakaosaveinfo />} />
        <Route path="/naversaveinfo/:nickname" element={<Naversaveinfo />} />
        <Route path="/findId" element={<FindId />} />

        
        {/* 고객센터 */}
        <Route path="/qna" element={<Qna />} />
        <Route path="/writeQna" element={<WriteQna />} />
        <Route path="/qnaView/:qseq" element={<QnaView/>} />

        {/* 여행 리뷰 */}
        <Route path="/reviewList" element={<ReviewList />} />
        <Route path="/writeReview" element={<WriteReview />} />
        <Route path="/reviewView/:rseq" element={<ReviewView />} />

        {/* 여행코스 의뢰 */}
        <Route path="/rcommunity" element={<RCommunityList />} /> 
        <Route path="/rpostwrite" element={<RPostWrite />} /> 
        <Route path="/rCommunityView/:rnum" element={<RCommunityView />} />
        <Route path="/rCommunityUpdate/:rnum" element={<RCommunityUpdate />} />
        
        
        
        <Route path="/mycourse" element={<Mycourse />} />
        <Route path="/house" element={<House />} />
        
        {/* 여행 콘텐츠 */}
        <Route path="/contents" element={<ContentsList />} />
        <Route path="/testlist" element={<Testcontents />} />
        <Route path="/getContentsView/:cseq" element={<ContentsView />} />

        {/* 마이페이지 */}
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/myInfo" element={<MyInfo />} />
        <Route path="/myReview" element={<MyReview />} />
        <Route path="/myQna" element={<MyQna />} />
        <Route path="/myRequest" element={<MyRequest />} />

        {/* 공지사항 */}
        <Route path="/notice" element={<Notice />} />
        <Route path="/contentsWrite" element={<ContentsWrite />} />

        
        {/* <Route path="/main" element={<Main />} />
        <Route path="/writePost" element={<WritePost />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/postone/:postid" element={<Postone />} />
        <Route path="/kakaosaveinfo/:nickname" element={<Kakaosaveinfo />} />
        <Route path="/editProfile" element={<EditProfile />} />
        <Route path="/memberPage/:membernick" element={<MemberPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;
