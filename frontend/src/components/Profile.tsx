import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  // @ts-ignore
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  const handleLogout = async (e: any) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/");
      console.log("Logged out");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Profile</h1>
      <h2>{user?.displayName}</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};
