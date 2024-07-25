import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectToken } from '../features/auth/authSlice';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { token } = useSelector(selectToken);

  return (
    <Route
      {...rest}
      render={props =>
        token ? <Component {...props} /> : <Navigate to="/login" />
      }
    />
  );
};

export default PrivateRoute;
