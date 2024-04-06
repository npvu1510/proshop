import { USERS_URL } from '../constants';
import apiSlice from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `${USERS_URL}/login`,
        method: 'POST',
        body: {
          email,
          password,
        },
      }),

      // invalidatesTags: ['user'],
    }),

    signup: builder.mutation({
      query: ({ name, email, password, confirmPassword }) => ({
        url: `${USERS_URL}/signup`,
        method: 'POST',
        body: {
          name,
          email,
          password,
        },
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation, useLogoutMutation } =
  userApiSlice;
