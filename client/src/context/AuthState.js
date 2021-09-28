import React, { useState, useCallback } from 'react';

import setAuthToken from '../utils/setAuthToken';

import AuthContext from './auth-context';

const AuthState = ({ children }) => {
  const [token, setToken] = useState(null);

  const login = useCallback((passedToken, rememberMe) => {
    if (rememberMe) {
      localStorage.setItem('token', passedToken);
    } else {
      sessionStorage.setItem('token', passedToken);
    }

    setAuthToken(passedToken);
    setToken(passedToken);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!token, token, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthState;
