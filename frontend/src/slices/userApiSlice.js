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
      query: ({ name, email, password }) => ({
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

    updateProfile: builder.mutation({
      query: ({ name, email, password }) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: { name, email, password },
      }),
    }),

    getUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),

    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data._id}`,
        method: 'PATCH',
        body: data,
      }),
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
