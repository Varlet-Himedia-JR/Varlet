
import {createSlice} from '@reduxjs/toolkit'
// slice 를 만들어 store 에 담고 reducer(action) 로 store(slice)의 상태를 업데이트 합니다
// reducer안에는 여러가지 동작의 함수들이 담겨서 사용될 수 있습니다


// 슬라이스를 만들고 store에 담아 관리합니다.
// 슬라이스란 Redux 상태(state)의 특정 부분을 관리하는데 사용하는 개념입니다.
// 하나의 슬라이스에는 여러 가지 상태를 객체 형태로 담고, reducer를 통해 상태를 관리합니다.
// reducer 안에는 상태를 어떻게 변경할지 정의된 함수들이 담겨 있습니다.

const initialState = {
  isCourseContentsVisible: false,
  isCourseCustom: false,
};


const courseSlice = createSlice({
  name: 'state',
  initialState,
  reducers: {
    changeCourseContentsState: (state, action) => {
      state.isCourseContentsVisible = !state.isCourseContentsVisible;
    },
    changeCourseCustomState: (state, action) => {
      state.isCourseCustom = !state.isCourseCustom;
    },
  },
});


export const { changeCourseContentsState, changeCourseCustomState } = courseSlice.actions;
export default courseSlice.reducer;
