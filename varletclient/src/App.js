import { Routes, Route } from "react-router-dom";

// import Login from './component/Login';
import Main from './component/Main';
import Login from "./component/Login";
// import Join from './component/member/Join';
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
        {/* <Route path="/join" element={<Join />} />
        <Route path="/main" element={<Main />} />
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
