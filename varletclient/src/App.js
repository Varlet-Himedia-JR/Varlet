import { Routes, Route } from "react-router-dom";

// import Login from './component/Login';
import Main from './component/Main';
import Login from "./component/Login";
import ReviewList from "./component/review/ReviewList";
import WriteReview from "./component/review/WriteReview";
import ReviewView from "./component/review/ReviewView";
import Qna from "./component/qna/Qna";
import RCommunityList from "./component/request/RCommunityList";
import RPostWrite from "./component/request/RPostWrite";
import Join from './component/member/Join';
import WriteQna from './component/qna/WriteQna';
import QnaView from './component/qna/QnaView';
import Mycourse from "./component/course/Mycourse";

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
        <Route path="/reviewList" element={<ReviewList />} />
        <Route path="/writeReview" element={<WriteReview />} />
        <Route path="/reviewView/:rseq" element={<ReviewView />} /> {/* 수정된 부분 */}
        <Route path="/rcommunity" element={<RCommunityList />} /> 
        <Route path="/rpostwrite" element={<RPostWrite />} /> 
        <Route path="/join" element={<Join />} />
        <Route path="/writeQna" element={<WriteQna />} />
        <Route path="/qnaView/:qseq" element={<QnaView />} />
        <Route path="/mycourse" element={<Mycourse />} />
        
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
