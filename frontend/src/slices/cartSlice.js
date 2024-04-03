import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [] };
console.log(initialState);

const formatCurrency = (num) => {
  return num.toFixed(2);
};

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
            ? { ...item, qty: item.qty + action.payload.qty }
            : item
        );
      else state.cartItems.push(action.payload);

      const itemsPrice = state.cartItems.reduce(
        (acc, currItem) => acc + currItem.price * currItem.qty,
        0
      );
      state.itemsPrice = formatCurrency(itemsPrice);

      const shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      state.shippingPrice = formatCurrency(shippingPrice);

      const taxPrice = itemsPrice + shippingPrice;
      state.taxPrice = formatCurrency(taxPrice);

      const totalPrice = itemsPrice + shippingPrice + taxPrice;
      state.totalPrice = formatCurrency(totalPrice);

      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export default cartSlice;
