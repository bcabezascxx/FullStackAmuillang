// PrivateRoute.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ allowedUserTypes, ...props }) => {
  const { isAuthenticated, userType } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si no se especifican allowedUserTypes o el usuario actual está en la lista permitida
  if (!allowedUserTypes || allowedUserTypes.includes(userType)) {
    return <Outlet {...props} />;
  }

  // Redirige a la página de inicio de sesión si el tipo de usuario no está permitido
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;

