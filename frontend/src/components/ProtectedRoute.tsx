import React from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

// @ts-ignore
export const ProtectedRoute = ({ children }) => {
  // @ts-ignore
  const { user } = UserAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
