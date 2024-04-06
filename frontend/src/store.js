import { configureStore } from '@reduxjs/toolkit';

import apiSlice from './slices/apiSlice';
import cartSlice from './slices/cartSlice';
import userSlice from './slices/userSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
