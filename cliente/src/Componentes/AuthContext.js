import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const [userType, setUserType] = useState(localStorage.getItem('userType') || ''); //verificar el tipo 


  const setAuthenticated = (authStatus,type) => {
    setIsAuthenticated(authStatus);
    localStorage.setItem('isAuthenticated', authStatus);

    setUserType(type);
    localStorage.setItem('userType', type);
  };

  const value = {
    isAuthenticated,
    setAuthenticated,
    userType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


