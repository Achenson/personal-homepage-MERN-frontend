import React, { ReactChild } from "react";
import { Navigate } from "react-router-dom";

interface Props {
  isAuthenticated: boolean;
  children: ReactChild;
}

function PublicRoute({ children, isAuthenticated }: Props): JSX.Element {
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}

export default PublicRoute;
