import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : {};

// console.log(initialState);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      if (action.payload) state.info = action.payload;
      localStorage.setItem('user', JSON.stringify(state));
    },

    removeUserInfo: (state, action) => {
      state.info = null;
      localStorage.removeItem('user');
    },
  },
});

export default userSlice;
export const { setUserInfo: setCredentials } = userSlice.actions;
