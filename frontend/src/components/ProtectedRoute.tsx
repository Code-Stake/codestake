import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

// @ts-ignore
export const ProtectedRoute = ({ children }) => {
  // @ts-ignore
  const { user, isLoading } = UserAuth();

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};
