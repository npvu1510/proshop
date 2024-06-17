import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ratingFilter: 0,
  sortFilter: 0,
  page: 1,
};

const reviewSlice = createSlice({
  name: 'review',
  initialState: initialState,
  reducers: {
    setRatingFilter: (state, action) => {
      state.ratingFilter = action.payload;
    },

    setSortFilter: (state, action) => {
      state.sortFilter = action.payload;
    },

    setPage: (state, action) => {
      state.page = action.payload;
    },
  },
});

export default reviewSlice;
