import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';

// 저장소를 세션을 이용하여 저장
// 세션 스토리지를 사용하여 Redux 상태를 저장합니다.
// 세션 스토리지는 브라우저 세션이 종료되면 데이터가 삭제됩니다.
import storage from 'redux-persist/lib/storage/session';
// 로컬 저장소(내 컴퓨터)를 이용
// import storage from 'redux-persist/lib/storage';

// 지금은 세션을 이용해서 리덕스를 저장하지만 나중엔 로컬 스토리지를 영구저장모드를 해제한 후 사용합니다
// 시큐리티 적용 후 리덕스의 저장내용은 로컬스토리지를 이용하면서 수시로 쿠키에서 업데이트하는 방식으로 바뀔 예정


import {combineReducers} from 'redux'; // 여러 리듀서를 결합하기 위해 combineReducers를 가져옵니다.
import {persistReducer} from 'redux-persist'; // 상태를 저장하고 복원하기 위해 persistReducer를 가져옵니다.


// 여러 리듀서를 결합하여 하나의 리듀서를 만듭니다.
// 여기서는 userSlice.reducer만 포함되어 있습니다.
const reducers = combineReducers({

    user : userSlice.reducer,
    // course: courseSlice.reducer, // courseSlice 추가
})
// persistConfig는 상태를 저장할 때의 설정을 정의합니다.
const persistConfig = {
    key:'root', // 저장소의 키 이름을 'root'로 설정합니다
    storage,    // 세션 스토리지를 사용합니다.
    whitelist: ['user', 'course'], // course를 whitelist에 추가했음, 어떤 상태를 저장할지 지정합니다. 
}

// persistReducer를 사용하여 상태를 저장할 리듀서를 만듭니다.
const persistedReducer = persistReducer(persistConfig, reducers);

//---------------------------------------------------

// 스토어에 configureStore를 이용해서 userSlice 를 등록
// configureStore를 사용하여 Redux Store를 설정합니다.
export default configureStore({
    // reducer: {    user:userSlice,  },  // 슬라이스를 직접 추가하는 방법입니다.
    reducer:persistedReducer, // persistReducer로 래핑된 리듀서를 사용하여 상태를 저장합니다.
    middleware:getDefaultMiddleware => getDefaultMiddleware({serializableCheck:false}), // 직렬화 체크를 비활성화하여 Redux Persist와의 호환성을 유지합니다
})
