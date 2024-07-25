import { combineReducers } from 'redux';
import authReducer from './auth/authSlice'; 
import ordersReducer from './orders/ordersSlice'; 

const rootReducer = combineReducers({
  auth: authReducer,
  orders: ordersReducer,
});

export default rootReducer;
