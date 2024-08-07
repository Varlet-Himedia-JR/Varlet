//jwtUtil.js
import axios from 'axios';
import { setCookie, getCookie,removeCookie} from "./cookieUtil";
// axios 인스턴스 생성
const jaxios = axios.create();

// 요청을 보내기 전에 실행되는 인터셉터
const beforeReq = async (config)=>{
    // 쿠키에서 user 정보를 가져온다
    const loginUser =  JSON.parse(getCookie('user')); // user 값을 가져오고 json으로 파싱

    // accessToken 은 header 에 refreshToken 은 pathvariable 에 실어서 전송
    const Header = { headers:{'Authorization' : `Bearer ${loginUser.accessToken}`}}
    const res = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`,Header);

    // 응답으로 부터 새로운 token들을 받아옴
    loginUser.accessToken = res.data.accessToken;
    loginUser.refreshToken = res.data.refreshToken;

    // 새로운 토큰으로 쿠키 갱신
    setCookie('user',JSON.stringify(loginUser));
    

    // 요청 헤더에 새로운 accessToken을 추가
    const {accessToken} = loginUser;
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
}
// 요청실패 시 
const requestFail = (err) => {

}

// 응답을 처리하기 전에 실행되는 인터셉터
const beforeRes = async (res) => {
    // 응답 데이터가 있고 오류가 'ERROR_ACCESS_TOKEN'인 경우
    if(res.data && res.data.error=='ERROR_ACCESS_TOKEN'){
        const loginUser = JSON.parse(getCookie('user'));
        const Header = { headers:{'Authorization' : `Bearer ${loginUser.accessToken}`}}
        const res = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`,Header);
         
        // accessToken을 Authorization 헤더에 추가하여 새로운 토큰을 얻기 위한 요청
        loginUser.accessToken = res.data.accessToken;
        loginUser.refreshToken = res.data.refreshToken;
        
        // 새로운 토큰으로 쿠키를 갱신
        setCookie('user',JSON.stringify(loginUser));
    
    }
    return res;
}
const responseFail = (err) => {}

jaxios.interceptors.request.use(beforeReq, requestFail);
jaxios.interceptors.request.use(beforeRes, responseFail);

export default jaxios;

