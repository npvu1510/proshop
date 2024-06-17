import apiSlice from './apiSlice';

const categoryApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => ({
        url: `/categories`,
        method: 'GET',
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoryApiSlice;
