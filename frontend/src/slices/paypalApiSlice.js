import apiSlice from './apiSlice';

const paypalSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPayPalClientId: builder.query({
      query: () => ({
        url: `/paypal-client-id`,
        method: 'GET',
      }),
    }),
  }),
});

export const { useGetPayPalClientIdQuery } = paypalSlice;
