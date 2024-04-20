import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: null };
// console.log(initialState);

const formatCurrency = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const isExist = state.cartItems.find(
        (item) => item._id === action.payload._id
      );

      if (isExist)
        state.cartItems = state.cartItems.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      else state.cartItems.push(action.payload);

      const itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + (item.price * 100 * item.qty) / 100,
        0
      );
      state.itemsPrice = formatCurrency(itemsPrice);

      const shippingPrice = state.itemsPrice > 100 ? 0 : 10;
      state.shippingPrice = formatCurrency(shippingPrice);

      const taxPrice = 0.15 * itemsPrice;
      state.taxPrice = formatCurrency(taxPrice);

      const totalPrice = itemsPrice + shippingPrice + taxPrice;
      state.totalPrice = formatCurrency(totalPrice);

      state.numItems = state.cartItems.reduce(
        (acc, curItem) => acc + curItem.qty,
        0
      );

      localStorage.setItem('cart', JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      const id = action.payload;

      state.cartItems = state.cartItems.filter(
        (cartItem) => cartItem._id !== id
      );

      localStorage.setItem('cart', JSON.stringify(state));
    },

    clearCart: (state, action) => {
      state.cartItems = [];
      state.numItems = state.cartItems.length;
      // state.shippingAddress = {};
      state.paymentMethod = null;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    setShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    setPaymentMethod: (state, action) => {
      console.log(action.payload);
      state.paymentMethod = action.payload;

      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export default cartSlice;
