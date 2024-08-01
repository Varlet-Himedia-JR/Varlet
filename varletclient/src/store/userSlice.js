import {createSlice} from '@reduxjs/toolkit'
// slice 를 만들어 store 에 담고 reducer(action) 로 store(slice)의 상태를 업데이트 합니다
// 하나의 슬라이스에 여러 자료를 객체형식으로 담고, reducer로 값을 관리합니다
// reducer안에는 여러가지 동작의 함수들이 담겨서 사용될 수 있습니다
const initialState = {
    email:'',
    nickname:'',
    phone:'',
    profileimg:'',
    profilemsg:'',
    provider:'',
    pwd:'',
    snsid:'',
    Followings:[],
    Followers:[],
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
                // 외부에서 전달되는 객체를 이안에슨ㄴ action 이라고 부르고
                // 'user'객체는 state 라고 부릅니다.
                state.email = action.payload.email;
                state.nickname = action.payload.nickname;
                state.provider = action.payload.provider;
                state.snsid = action.payload.snsid;
                state.profileimg = action.payload.profileimg;
                state.profilemsg = action.payload.profilemsg;
                state.pwd = action.payload.pwd;
                state.phone = action.payload.phone;
                state.accessToken= action.payload.access_token;
                state.refreshToken= action.payload.refresh_token;
            },
            logoutAction:(state)=>{
                state.email = '';
                state.nickname = '';
                state.provider = '';
                state.snsid = '';
                state.profileimg = '';
                state.profilemsg = '';
                state.pwd = '';
                state.phone = '';
                state.accessToken='';
                state.refreshToken='';
            },
            setFollowings : (state, action)=>{
                state.Followings = action.payload.followings;
            },
            setFollowers : (state, action)=>{
                state.Followers = action.payload.followers;
            },

        }
    }
);

export const { loginAction, logoutAction, setFollowings,  setFollowers} = userSlice.actions;
export default userSlice;