import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('userInfo')
  ? { userInfo: JSON.parse(localStorage.getItem('userInfo')) }
  : { userInfo: null };

// console.log(initialState);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeUser: (state, action) => {
      state.userInfo = null;
      localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
    },
  },
});

export default userSlice;
export const { setCredentials } = userSlice.actions;
