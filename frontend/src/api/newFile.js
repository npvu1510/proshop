import { api, isRefreshingToken, requestQueue } from './apiClient';

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

        if (isRefreshingToken) {
          return Promise((resolve, reject) => {
            requestQueue.push((error = null) => {
              if (error) return reject(error);
              console.log('Không lỗi');
              return resolve(api(originalRequest));
            });
          });
        }

        // Xin token mới
        await api({ url: '/auth/refresh', method: 'GET' });

        // console.log(res);
        // return Promise.resolve(api(originalRequest));
        return new Promise((resolve, reject) => {});
      } catch (err) {
        console.log('ERROR FROM INTERCEPTORS');
        console.log(err);
        return Promise.reject(err);
      }
    }

    console.log(err);
  }
);
