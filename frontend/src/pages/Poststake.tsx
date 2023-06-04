import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Poststake = () => {
  const location = useLocation();
  const winner = location.state?.winner; // Access the winner parameter
  const [mode, setMode] = useState("light");

  useEffect(() => {
    if (mode === "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    }
    console.log(document.body.classList);
  }, [mode]);

  console.log(winner);

  const Navbar = () => {
    return (
      <div className="flex flex-row items-center justify-between px-4 py-4 h-16 bg-[#e6e6e6] text-[#010101] dark:text-[#f5f5f5] dark:bg-[#1e293b] ">
        {/* <button
          onClick={() => {
            setMode(mode === "dark" ? "light" : "dark");
          }}
          className="bg-[#0065f1] text-white px-4 py-2 rounded-md h-10"
        >
          Toggle Dark Mode
        </button> */}
        <a href="/dashboard">
          <img src="/blue.svg" width={70} height={30} />
        </a>
        <div className="flex justify-center items-center bg-clip-text font-bold text-2xl  dark:text-[#f5f5f5] text-[#1e293b]">
          CodeStake
        </div>

        <button
          onClick={() => {
            setMode(mode === "dark" ? "light" : "dark");
          }}
        >
          {mode === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#f5f5f5"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#101010"
              className="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
              />
            </svg>
          )}
        </button>
      </div>
    );
  };

  return (
    <div>
      <Navbar />

      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center">
          <h1
            className="
            text-4xl font-bold text-[#35ce5b] dark:text-[#f5f5f5] text-red-500"
          >
            Congratulations! You Win{" "}
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Poststake;
