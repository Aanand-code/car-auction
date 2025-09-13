import axios from 'axios';
import useAuthStore from '../hooks/useAuthStore';

const api = axios.create({
  baseURL: 'http://localhost:7777/api/v1',
  withCredentials: true,
});

export const refreshApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

//Run before every request and attach the accessToken to every request headers
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    // console.log('request');

    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//Run after every request to check if it is response 401 or not
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // console.log('response');

    const originalRequest = error?.config;
    const { refreshAccessToken, clearAuth } = useAuthStore.getState();

    // console.log(error?.response);

    if (error?.response?.status === 401) {
      try {
        const newAccessToken = await refreshAccessToken();
        if (!newAccessToken) {
          clearAuth();
          return Promise.reject(error);
        }

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {
        console.error('Token refresh failed', err);
        clearAuth();
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
