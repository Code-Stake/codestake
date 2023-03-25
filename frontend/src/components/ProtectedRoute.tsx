import React from "react";
import { Route, Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { useState } from "react";

export const ProtectedRoute = ({ children }: any) => {
  const [userAuthencated, setUserAuthencated] = useState<boolean>(false);

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUserAuthencated(true);
    } else {
      setUserAuthencated(false);
    }
  });

  return userAuthencated ? <Route>{children}</Route> : <Navigate to="/login" />;
};
