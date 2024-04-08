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

    getOrderById: builder.query({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}`,
        method: 'GET',
      }),
    }),
    payOrder: builder.mutation({
      query: ({ id, details }) => ({
        url: `${ORDERS_URL}/${id}/pay`,
        method: 'PATCH',
        body: details,
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/my-orders`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useGetMyOrdersQuery,
} = orderApiSlice;
