import { REVIEWS_URL } from '../constants';
import apiSlice from './apiSlice';

const reviewApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    newReview: builder.mutation({
      query: (data) => ({
        url: `${REVIEWS_URL}/${data.productId}`,
        method: 'POST',
        data: data,
      }),
    }),
  }),
});

export const { useNewReviewMutation } = reviewApiSlice;
