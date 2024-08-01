import {configureStore} from '@reduxjs/toolkit';
import userSlice from './userSlice';

// 저장소를 세션을 이용하여 저장
import storage from 'redux-persist/lib/storage/session';
// 로컬 저장소(내컴퓨터)를 이용
// import storage from 'redux-persist/lib/storage';

// 지금은 세션을 이용해서 리덕스를 저장하지만 나중엔 로컬 스토리지를 영구저장모드를 해제한 후 사용합니다
// 시큐리티 적용 후 리덕스의 저장내용은 로컬스토리지를 이용하면서 수시로 쿠키에서 업데이트하는 방식으로 바뀔 예정

import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';

const reducers = combineReducers({
    user : userSlice.reducer,
})
const persistConfig = {
    key:'root',
    storage,
    whitelist:['user']
}
const persistedReducer = persistReducer(persistConfig, reducers);
//---------------------------------------------------

// 스토어에 configureStore를 이용해서 userSlice 를 등록
export default configureStore({
    // reducer: {    user:userSlice,  },
    reducer:persistedReducer,
    middleware:getDefaultMiddleware => getDefaultMiddleware({serializableCheck:false}),
})




