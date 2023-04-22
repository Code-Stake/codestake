/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/

import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";

export default function Login() {
  // @ts-ignore
  const { signUpWithGoogle } = UserAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      await signUpWithGoogle().then(() => {
        navigate("/dashboard");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <button onClick={handleLogin}>Sign in with Google</button>
        </div>
      </div>
    </div>
  );
}
