import React from "react";
import { Route, Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useState } from "react";

export const ProtectedRoute = ({ children }: any) => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);

  // Check if user is authenticated
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    setAuthenticated(true);
  }

  // Render component if authenticated, otherwise redirect to login
  return authenticated ? <Route>{children}</Route> : <Navigate to="/login" replace={true} />;
};

// const PrivateRoute = ({ component: Component, authenticated, ...rest }) => {
//   return (
//     <Route
//       {...rest}
//       render={(props) => (authenticated ? <Component {...props} /> : <Redirect to="/login" />)}
//     />
//   );
// };
