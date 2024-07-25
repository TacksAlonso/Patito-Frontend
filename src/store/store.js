import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import ordersReducer from '../features/orders/ordersSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    orders: ordersReducer,
  },
});

export default store;
