import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import AuthContext from '../../context/auth-context';

const ProtectedRoutes = ({ children }) => {
  const authContext = useContext(AuthContext);
  const { isAuthenticated } = authContext;

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  } else {
    return children;
  }
};

export default ProtectedRoutes;
