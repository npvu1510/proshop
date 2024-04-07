import apiSlice from './apiSlice';

import { ORDERS_URL } from '../constants';

const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${ORDERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useCreateOrderMutation } = orderApiSlice;
