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

    deliverOrder: builder.mutation({
      query: (id) => ({
        url: `${ORDERS_URL}/${id}/deliver`,
        method: 'PATCH',
      }),
    }),

    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/my-orders`,
        method: 'GET',
      }),
    }),

    getOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
  usePayOrderMutation,
  useDeliverOrderMutation,
  useGetMyOrdersQuery,
  useGetOrdersQuery,
} = orderApiSlice;
