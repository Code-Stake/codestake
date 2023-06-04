import React from "react";
import { UserAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PaperClipIcon } from "@heroicons/react/20/solid";

export const Profile = () => {
  // @ts-ignore
  const { user, logout } = UserAuth();
  const navigate = useNavigate();

  //   const fetchSampleEndpoint = async () => {
  //     const response = await CodeStake.get("/");
  //     console.log(response);
  //   };

  //   useEffect(() => {
  //     fetchSampleEndpoint();
  //   }, []);

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
      {/* <button onClick={handleLogout}>Logout</button> */}

      <div className="bg-gray-100 min-h-screen flex flex-col justify-center py-12 lg:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Profile</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow  sm:px-10">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="full_name"
                  id="full_name"
                  contentEditable={false}
                  readOnly={true}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={user?.displayName}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  readOnly={true}
                  value={user?.email}
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Summary
              </label>
              <div className="mt-1">
                <textarea
                  id="summary"
                  name="summary"
                  rows={3}
                  className=" block w-full sm:text-sm bg-white border border-gray-300"
                  placeholder="Tell us a little about yourself (interests, career, etc.)"
                />
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center bg-codestake hover:bg-opacity-80 active:bg-opacity-60 text-white py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-codestake focus:ring-offset-2"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
