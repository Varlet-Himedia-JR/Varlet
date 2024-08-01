import { Cookies } from "react-cookie";
const cookies = new Cookies()

export const setCookie=(name,value,days=1)=>{
    const expires = new Date() // 오늘 날짜 시간
    expires.setUTCDate(expires.getUTCDate() + days) // 보관기한 설정
    return cookies.set(name,value, {path:'/',expires:expires})
}

export const getCookie=(name)=>{
    return cookies.get(name)
}

export const removeCookie = (name, path="/")=>{
    cookies.remove(name,{path})
}