import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';

export const createApiCall = (baseURL, token) => {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  
  return instance;
};

export const useApiConstructor = (baseURL) => {
  const token = useSelector(selectToken);
  return createApiCall(baseURL, token);
};
