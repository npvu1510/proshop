import { PRODUCTS_URL } from '../constants';
import apiSlice from './apiSlice';

export const productSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: (data) => ({
        url: PRODUCTS_URL,
        params: data,
      }),
      keepUnusedDataFor: 5,
    }),

    getTopRatingProducts: builder.query({
      query: () => ({
        url: `${PRODUCTS_URL}/top-3-rating`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),

    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
    }),

    createProduct: builder.mutation({
      query: (product) => ({
        url: PRODUCTS_URL,
        method: 'POST',
        body: product,
      }),
    }),

    updateProduct: builder.mutation({
      query: (product) => ({
        url: PRODUCTS_URL,
        method: 'PATCH',
        body: product,
      }),
    }),

    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCTS_URL}/${productId}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetTopRatingProductsQuery,
  useGetProductDetailsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productSlice;
