import { configureStore } from '@reduxjs/toolkit';

import apiSlice from './slices/apiSlice';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';
import reviewSlice from './slices/reviewSlice';
import productSlice from './slices/productSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSlice.reducer,
    user: userSlice.reducer,
    review: reviewSlice.reducer,
    product: productSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
