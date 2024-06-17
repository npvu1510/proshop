import apiSlice from './apiSlice';

import { AUTH_URL } from '../constants';

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        data: {
          email,
          password,
        },
      }),

      // invalidatesTags: ['user'],
    }),

    signup: builder.mutation({
      query: ({ name, email, password }) => ({
        url: `${AUTH_URL}/signup`,
        method: 'POST',
        data: {
          name,
          email,
          password,
        },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  authApiSlice;
