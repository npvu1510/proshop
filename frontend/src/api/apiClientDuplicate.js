import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

let isRefreshingToken = false;
let requestQueue = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response.data.message === 'jwt expired' &&
      !originalRequest.isRefreshed
    ) {
      try {
        originalRequest.isRefreshed = true;
        await api({ url: '/auth/refresh', method: 'GET' });

        return Promise.resolve(api(originalRequest));
      } catch (err) {
        console.log('ERROR FROM INTERCEPTORS');
        console.log(err);
        return Promise.reject(err);
      }
    }

    console.log(err);
  }
);

// custom basequery
export const axiosBaseQuery =
  ({ baseUrl } = { baseUrl: '' }) =>
  async ({ url, method, data, params, headers }) => {
    try {
      const result = await api({
        url: baseUrl + url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };

export default api;
