//jwtUtil.js
import axios from 'axios';
import { setCookie, getCookie,removeCookie} from "./cookieUtil";
const jaxios = axios.create();

const beforeReq = async (config)=>{
    const {loginUser} = getCookie('user');

    // accessToken 은 header 에 refreshToken 은 pathvariable 에 실어서 전송
    const Header = { headers:{'Authorization' : `Bearer ${loginUser.accessToken}`}}
    const res = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`,Header);

    loginUser.accessToken = res.data.accessToken;
    loginUser.refreshToken = res.data.refreshToken;

    setCookie('user',JSON.stringify(loginUser),1);
    
    const {accessToken} = loginUser;
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
}
const requestFail = (err) => {}
const beforeRes = async (res) => {
    if(res.data && res.data.error=='ERROR_ACCESS_TOKEN'){
        const {loginUser} = getCookie('user');
        const Header = { headers:{'Authorization' : `Bearer ${loginUser.accessToken}`}}
        const res = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`,Header);

        loginUser.accessToken = res.data.accessToken;
        loginUser.refreshToken = res.data.refreshToken;
    
        setCookie('user',JSON.stringify(loginUser),1);
    
    }
    return res;
}
const responseFail = (err) => {}

jaxios.interceptors.request.use(beforeReq, requestFail);
jaxios.interceptors.request.use(beforeRes, responseFail);

export default jaxios;

