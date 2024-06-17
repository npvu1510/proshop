import { createApi } from '@reduxjs/toolkit/query/react';

import { axiosBaseQuery } from '../api/apiClient.js';
// import { axiosBaseQuery } from '../api/apiClientDuplicate.js';

const apiSlice = createApi({
  reducerPath: 'api',
  // baseQuery: fetchBaseQuery({
  //   baseUrl: BASE_URL,
  // }),
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({}),
});

export default apiSlice;
