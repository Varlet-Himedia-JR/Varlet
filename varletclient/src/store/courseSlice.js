import { createSlice } from '@reduxjs/toolkit';

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
