//jwtUtil.js

import axios from "axios";
import { setCookie , getCookie } from "./cookieUtil";
const jaxios = axios.create();

const beforeReq=async (config)=>{
    // console.log('-----------jwt start-------------');
    let cUser = getCookie('user');
    // console.log('cookie info : ',getCookie('user'));
    // console.log(cUser);
    // console.log('new log before : ', getCookie('user').refresh_token);
    
    // console.log('new log before re: ', cUser.refresh_token);
    // console.log('new log before ac: ', cUser.access_token);

    // accessToken 은 header에  refreshToken 은 pathvariable 에 실어서 전송
    const Header = { headers:{'Authorization' : `Bearer ${cUser.access_token}` } }
    const res = await axios.get(`/api/member/refresh/${cUser.refresh_token}`, Header );
    cUser.access_token = res.data.access_token;
    cUser.refresh_token = res.data.refresh_token;
    // console.log('------------------------');
    // console.log('new log after refresh : ', cUser.refresh_token);
    // console.log('new log after access : ', cUser.access_token);
    setCookie('user', JSON.stringify(cUser), 1);
    const { accessToken } = cUser;
    config.headers.Authorization = `Bearer ${accessToken}`
    return config;
}
const requestFail=(err)=>{ }

const beforeRes=async (res)=>{ 

    // if( res.data && res.data.error =='ERROR_ACCESS_TOKEN'){
    //     let loginUser = getCookie('user');
    //     const Header = { headers:{'Authorization' : `Bearer ${loginUser.accessToken}` } }
    //     const res = await axios.get(`/api/member/refresh/${loginUser.refreshToken}`, Header );
    //     loginUser.accessToken = res.data.accessToken;
    //     loginUser.refreshToken = res.data.refreshToken;
    //     setCookie('user', JSON.stringify(loginUser), 1);
    //     loginUser = getCookie('user');
    // }

    
    return res;
}

const responseFail=(err)=>{ }

jaxios.interceptors.request.use( beforeReq, requestFail );
jaxios.interceptors.response.use( beforeRes, responseFail)

export default jaxios;