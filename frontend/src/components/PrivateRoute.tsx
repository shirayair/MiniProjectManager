import React from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
  children: React.ReactElement;
};

const PrivateRoute: React.FC<Props> = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
