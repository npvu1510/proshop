import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : {};

// console.log(initialState);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload.userInfo;
      state.token = action.payload.token;
      localStorage.setItem('user', JSON.stringify(state));
    },

    removeUser: (state, action) => {
      state.userInfo = null;
      state.token = null;
      localStorage.setItem('user', JSON.stringify(state));
    },
  },
});

export default userSlice;
export const { setCredentials } = userSlice.actions;
