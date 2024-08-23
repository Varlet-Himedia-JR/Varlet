//jwtUtil.js

import axios from "axios";
import { setCookie , getCookie } from "./cookieUtil";

// axios 인스턴스를 생성합니다.
const jaxios = axios.create();

const beforeReq=async (config)=>{
    // 쿠키에서 사용자 정보를 가져옵니다.
    let cUser = getCookie('user');

    // accessToken 은 header에  refreshToken 은 pathvariable 에 실어서 전송
    // 요청 전에 리프레시 토큰을 사용하여 새로운 액세스 토큰을 가져옵니다.
    const Header = { headers:{'Authorization' : `Bearer ${cUser.access_token}` } }
    const res = await axios.get(`/api/member/refresh/${cUser.refresh_token}`, Header );

    // 서버로부터 받은 새로운 액세스 토큰과 리프레시 토큰을 쿠키에 저장합니다.
    cUser.access_token = res.data.access_token;
    cUser.refresh_token = res.data.refresh_token;
    setCookie('user', JSON.stringify(cUser), 1);

    // 요청 헤더에 새로운 액세스 토큰을 설정합니다.
    const { accessToken } = cUser;
    config.headers.Authorization = `Bearer ${accessToken}`
    return config;
}

// 요청 실패시 
const requestFail=(err)=>{ }

const beforeRes=async (res)=>{ 
     // 응답 데이터에 'ERROR_ACCESS_TOKEN' 오류가 포함된 경우
    if( res.data && res.data.error === 'ERROR_ACCESS_TOKEN'){
        // 쿠키에서 로그인한 사용자 정보를 가져옵니다.
        let loginUser = getCookie('user');
         // 액세스 토큰을 갱신하기 위해 서버에 요청을 보냅니다.
        const Header = { headers:{'Authorization' : `Bearer ${loginUser.accessToken}` } }
        const res = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`, Header );
           // 서버로부터 받은 새로운 액세스 토큰과 리프레시 토큰을 쿠키에 저장합니다
        loginUser.accessToken = res.data.accessToken;
        loginUser.refreshToken = res.data.refreshToken;
        setCookie('user', JSON.stringify(loginUser), 1);
        // 쿠키에서 새로 갱신된 사용자 정보를 가져옵니다.
        loginUser = getCookie('user');
    }

     // 응답 객체를 반환합니다. (변경된 경우 포함)
    return res;
}

// 응답 실패시
const responseFail=(err)=>{ }

jaxios.interceptors.request.use( beforeReq, requestFail );
jaxios.interceptors.response.use( beforeRes, responseFail)

export default jaxios;