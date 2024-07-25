import axios from 'axios';

const createApiInstance = (baseURL) => {
  const api = axios.create({
    baseURL: baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  api.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
  );

  return api;
};

export default createApiInstance;
