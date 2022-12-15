import React, { ReactChild } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
  children: ReactChild;
}

function PrivateRoute({ children, isAuthenticated }: Props): JSX.Element {
  if (!isAuthenticated) {
    return <Navigate to="/login-register" />;
  }

  return <>{children}</>;
}

export default PrivateRoute;
