import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

// @ts-ignore
export const ProtectedRoute = ({ children }) => {
  // @ts-ignore
  const { user } = UserAuth();

  useEffect(() => {
    const handleRouteChange = () => {
      if (!user) {
        return <Navigate to="/login" />;
      }
    };

    handleRouteChange();
  }, [user]);

  return <>{children}</>;
};
