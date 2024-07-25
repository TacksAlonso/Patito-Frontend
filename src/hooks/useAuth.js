import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';

const useAuth = () => {
  const token = useSelector(selectToken);
  return token;
};

export default useAuth;
