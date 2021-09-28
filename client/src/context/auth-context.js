import React from 'react';

const defaultValue = {
  isAuthenticated: false,
  token: null,
  login: () => {},
  logout: () => {},
};

const authContext = React.createContext(defaultValue);

export default authContext;
