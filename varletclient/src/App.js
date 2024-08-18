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
import RcCommunityWrite from "./component/request/RcCommunityWrite";
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


import 'ckeditor5/ckeditor5.css';

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
        <Route path="/login" element={<Login />} />
        <Route path="/qna" element={<Qna />} />
        <Route path="/reviewList" element={<ReviewList />} />
        <Route path="/writeReview" element={<WriteReview />} />
        <Route path="/reviewView/:rseq" element={<ReviewView />} /> {/* 수정된 부분 */}
        <Route path="/rcommunity" element={<RCommunityList />} /> 
        <Route path="/rpostwrite" element={<RPostWrite />} /> 
        <Route path="/rCommunityView/:rnum" element={<RCommunityView />} />
        <Route path="/join" element={<Join />} />
        <Route path="/writeQna" element={<WriteQna />} />
        <Route path="/qnaView/:qseq" element={<QnaView/>} />
        <Route path="/mycourse" element={<Mycourse />} />
        <Route path="/kakaosaveinfo/:nickname" element={<Kakaosaveinfo />} />
        <Route path="/naversaveinfo/:nickname" element={<Naversaveinfo />} />
        <Route path="/contents" element={<ContentsList />} />
        <Route path="/ctest" element={<Testcontents />} />
        <Route path="/getContentsView/:cseq" element={<ContentsView />} />
        <Route path="/rCommunityUpdate/:rnum" element={<RCommunityUpdate />} />
        <Route path="/rCommunityDetail/:rnum/rcCommunityWrite" element={<RcCommunityWrite />} />
        <Route path="/myPage" element={<MyPage />} />
        <Route path="/myInfo" element={<MyInfo />} />
        <Route path="/myReview" element={<MyReview />} />
        <Route path="/myQna" element={<MyQna />} />
        <Route path="/myRequest" element={<MyRequest />} />

        
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
