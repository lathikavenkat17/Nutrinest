import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");
  const location = useLocation();

  if (!token || !expiry || new Date().getTime() > expiry) {
    localStorage.clear();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default RequireAuth;
