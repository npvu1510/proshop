import { createSlice } from '@reduxjs/toolkit';

const minPrice = 0;
const maxPrice = 5000;

const initialState = {
  filter: {
    categories: ['All'],
    status: 'All',
    minPrice,
    maxPrice,
    priceRange: [minPrice, maxPrice],
  },
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setCategoriesFilter: (state, action) => {
      state.filter.categories = action.payload;
    },

    setPriceRange: (state, action) => {
      state.filter.priceRange = action.payload;
    },

    setStatusFilter: (state, action) => {
      state.filter.status = action.payload;
    },
  },
});

export default productSlice;
