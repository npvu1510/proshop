import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

let isRefreshingToken = false;
let requestQueue = [];

const sendAllRequestQueue = (error = null) => {
  console.log(`Hàng đợi đang có ${requestQueue.length} request cần giải quyết`);
  requestQueue.forEach((callback) => callback(error));
  requestQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.data?.message === 'jwt expired' &&
      !originalRequest._retry
    ) {
      if (isRefreshingToken) {
        // Thêm yêu cầu vào hàng đợi
        return new Promise((resolve, reject) => {
          console.log(`${originalRequest.url} vào hàng đợi`);

          requestQueue.push((error = null) => {
            if (error) return reject(error);
            console.log('Không lỗi');
            return resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshingToken = true;

      try {
        console.log(`${originalRequest.url} sẽ xin token`);

        // Xin token mới
        await api({ url: '/auth/refresh', method: 'GET' });
        console.log(`${originalRequest.url} xin token thành công`);

        // Giải quyết hàng đợi request
        sendAllRequestQueue();
        isRefreshingToken = false;

        return api(originalRequest);
      } catch (refreshError) {
        console.log('ERROR FROM INTERCEPTORS');
        console.log(refreshError);

        sendAllRequestQueue(refreshError);
        isRefreshingToken = false;

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(err);
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
      console.log('LỖI TRONG BASE QUERY');
      console.log(err);
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data || err.message,
        },
      };
    }
  };
export default api;
