import { USERS_URL } from '../constants';
import apiSlice from './apiSlice';

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: ({ name, email, password }) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        data: { name, email, password },
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
        data: data,
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
  useUpdateProfileMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApiSlice;
