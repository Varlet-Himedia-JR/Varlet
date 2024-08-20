import { Cookies } from "react-cookie";
const cookies = new Cookies()

// 쿠키설정
export const setCookie=(name,value)=>{
    return cookies.set(name,value, {path:'/'})
}
// 쿠키 읽기
export const getCookie=(name)=>{
    return cookies.get(name)
    
}
// 쿠키 삭제
export const removeCookie = (name, path="/")=>{
    cookies.remove(name,{path})
}
