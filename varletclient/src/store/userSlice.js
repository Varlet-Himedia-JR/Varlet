import {createSlice} from '@reduxjs/toolkit'
// slice 를 만들어 store 에 담고 reducer(action) 로 store(slice)의 상태를 업데이트 합니다
// 하나의 슬라이스에 여러 자료를 객체형식으로 담고, reducer로 값을 관리합니다
// reducer안에는 여러가지 동작의 함수들이 담겨서 사용될 수 있습니다
const initialState = {
    email:'',
    nickname:'',
    phone:'',
    profileimg:'',
    zipCode:'',
    address:'',
    dAddress:'',
    indate:'',
    isLogin:'',
    provider:'',
    pwd:'',
    snsid:'',
    accessToken:'',
    refreshToken:'',
}

const userSlice = createSlice(
    {
        name : 'user' ,   // userSlice 안에 저장되는 저장객체의 이름
        initialState ,
        reducers:{
            loginAction:(state, action)=>{
                // 외부에서 전달되는 객체를 내부의 'user'객체에 저장할껀데
                // 외부에서 전달되는 객체를 이 안에 쓴 action 이라고 부르고
                // 'user'객체는 state 라고 부릅니다.
                state.email = action.payload.email;
                state.nickname = action.payload.nickname;
                state.phone = action.payload.phone;
                state.profileimg = action.payload.profileimg;
                state.zipCode = action.payload.zipCode;
                state.address = action.payload.address;
                state.dAddress = action.payload.dAddress;
                state.indate = action.payload.indate;
                state.isLogin = action.payload.isLogin;
                state.provider = action.payload.provider;
                state.snsid = action.payload.snsid;
                state.pwd = action.payload.pwd;
                state.accessToken= action.payload.access_token;
                state.refreshToken= action.payload.refresh_token;
            },
            logoutAction:(state)=>{
                state.email = '';
                state.nickname = '';
                state.phone = '';
                state.profileimg = '';
                state.zipCode ='';
                state.address ='';
                state.dAddress ='';
                state.indate ='';
                state.isLogin = '';
                state.provider = '';
                state.snsid = '';
                state.pwd = '';
                state.accessToken='';
                state.refreshToken='';
            },
        }
    }
);

export const { loginAction, logoutAction} = userSlice.actions;
export default userSlice;