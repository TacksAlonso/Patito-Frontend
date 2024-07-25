import axios from 'axios';

const createApiCall = (baseURL, token) => {
  const apiInstance = axios.create({ baseURL });

  apiInstance.interceptors.request.use((config) => {
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return apiInstance;
};


export { createApiCall };

