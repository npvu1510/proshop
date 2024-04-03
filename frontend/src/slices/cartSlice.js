import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] };
console.log(initialState);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      console.log(action.payload);

      const isExist = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (isExist)
        state.cartItems = state.cartItems.map((item) =>
          item._id === action.payload._id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      else state.cartItems.push(action.payload);

      state.itemsPrice = state.cartItems.reduce(
        (acc, currItem) => acc + currItem.price * currItem.qty,
        0
      );

      state.shippingPrice = state.itemsPrice > 100 ? 10 : 0;

      state.taxPrice = (state.itemsPrice + state.shippingPrice) * 0.1;

      state.totalPrice =
        state.itemsPrice + state.shippingPrice + state.taxPrice;

      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export default cartSlice;
