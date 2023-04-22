// // Dependencies
// import React from "react";

// // Components
// import { ToastContainer } from "react-toastify";
// import LanguagesDropdown from "./LanguagesDropdown";
// import ThemeDropdown from "./ThemeDropdown";
// import CodeEditorWindow from "./editor/CodeEditorWindow";
// import OutputWindow from "./OutputWindow";
// import CustomInput from "./editor/CustomInput";
// import OutputDetails from "./OutputDetails";
// import { classnames } from "../utils/general";

// type props = {
//   onLanguageChange: (sl: any) => void;
//   onThemeChange: (sl: any) => void;
//   theme: { value: string };
//   starterCode: string;
//   onCodeChange: (code: string) => void;
//   codeLanguage: { value: string };
//   outputDetails: string;
//   testCaseInput: string;
//   setCustomInput: (input: string) => void;
//   onCompile: () => void;
//   processing: boolean;
// };

// export const MatchInterfaceFrontend = ({
//   onLanguageChange, // callback function
//   onThemeChange, // callback function
//   theme, // state
//   starterCode, // state
//   onCodeChange, // callback function
//   codeLanguage, // state
//   outputDetails, // state
//   testCaseInput, // state
//   setCustomInput, // callback function
//   onCompile, // callback function
//   processing, // state
// }: props) => {
//   return (
//     <>
//       <ToastContainer
//         position="top-right"
//         autoClose={2000}
//         hideProgressBar={false}
//         newestOnTop={false}
//         closeOnClick
//         rtl={false}
//         pauseOnFocusLoss
//         draggable
//         pauseOnHover
//       />
//       <div className="h-16 w-full bg-gradient-to-r from-pink-500 via-blue-500 to-red-500"></div>
//       <div className="flex flex-row">
//         <div className="px-4 py-2">
//           <LanguagesDropdown onSelectChange={onLanguageChange} />
//         </div>
//         <div className="px-4 py-2">
//           <ThemeDropdown handleThemeChange={onThemeChange} theme={theme} />
//         </div>
//       </div>
//       <div className="flex flex-row space-x-4 items-start px-4 py-4">
//         <div className="flex flex-col w-1/2 h-3/4 bg-blue-500 justify-start items-end">
//           <CodeEditorWindow
//             code={starterCode}
//             onChange={onCodeChange}
//             language={codeLanguage?.value}
//             theme={typeof theme === "string" ? theme : theme.value}
//           />
//         </div>

//         <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
//           <OutputWindow outputDetails={outputDetails} />
//           <div className="flex flex-col items-end">
//             <CustomInput customInput={testCaseInput} setCustomInput={setCustomInput} />
//             <button
//               onClick={onCompile}
//               disabled={!starterCode}
//               className={classnames(
//                 "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
//                 !starterCode ? "opacity-50" : ""
//               )}
//             >
//               {processing ? "Processing..." : "Compile and Execute"}
//             </button>
//           </div>
//           {outputDetails && <OutputDetails outputDetails={outputDetails} />}
//         </div>
//       </div>
//     </>
//   );
// };

export {};
