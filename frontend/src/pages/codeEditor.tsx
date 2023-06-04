// Landing.js

import { useEffect, useState } from "react";
import CodeEditorWindow from "../components/editor/CodeEditorWindow";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import "../index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineThemes";
import OutputWindow from "../components/editor/OutputWindow";
import CustomInput from "../components/editor/CustomInput";
import OutputDetails from "../components/editor/OutputDetails";
import ThemeDropdown from "../components/editor/ThemeDropdown";
import LanguagesDropdown from "../components/editor/LanguagesDropdown";
import axios from "axios";
import { compile } from "../api/compile";
// import { Bar, Container, Section } from "react-simple-resizer";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

type themeType = { value: string; label: string } | string;

export const CodeEditor = () => {
  // UI related states
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState<any>(null);
  const [processing, setProcessing] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<themeType>("cobalt");
  const [language, setLanguage] = useState(languageOptions[37]);

  //  Code related states
  const [questionContents, setQuestionContents] = useState<any>({});
  const [preProcessingCode, setPreProcessingCode] = useState<any>("");
  const [code, setCode] = useState("");
  const [testCaseInput, setTestCaseInput] = useState("[1,2,3,4]");
  const [testCaseOuput, setTestCaseOutput] = useState("[4, 3, 2, 1]");
  const [testCaseInputs, setTestCaseInputs] = useState<any>({});
  const [testCaseOutputs, setTestCaseOutputs] = useState<any>({});
  const [exeCode, setExeCode] = useState<any>("");
  const [prompt, setPrompt] = useState("");
  const [inputs, setInputs] = useState<any>([]);
  const [outputs, setOutputs] = useState<any>([]);

  const getQuestionContent = () => {
    axios.get("http://localhost:3001/api/question/content").then((response) => {
      console.log(response);
      setQuestionContents(response.data);
      setPreProcessingCode(response.data["preProcessingCode"]);
      setPrompt(response.data["prompt"]);
      setCode(response.data["starterCode"].trim());
      setExeCode(response.data["executionCode"]);
      setInputs(response.data["inputs"]);
      setOutputs(response.data["outputs"]);
      setTestCaseInputs({
        1: response.data["testCaseInput1"].trim(),
        2: response.data["testCaseInput2"].trim(),
        3: response.data["testCaseInput3"].trim(),
      });
      setTestCaseOutputs({
        1: response.data["testCaseOutput1"].trim(),
        2: response.data["testCaseOutput2"].trim(),
        3: response.data["testCaseOutput3"].trim(),
      });
    });
  };

  const [mode, setMode] = useState("light");
  useEffect(() => {
    if (mode === "light") {
      document.body.classList.remove("dark");
      document.body.classList.add("light");
      setTheme("cobalt");
    } else {
      document.body.classList.remove("light");
      document.body.classList.add("dark");
      setTheme("monokai");
    }
    console.log(document.body.classList);
  }, [mode]);

  // Initial GET request to get the question content
  useEffect(() => {
    getQuestionContent();
  }, []);

  // UI related functions
  const onSelectChange = (sl: any) => {
    setLanguage(sl);
  };
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);
  function handleThemeChange(th: any) {}

  const showSuccessToast = (msg: any) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg?: any) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const onChange = (action: any, data: any) => {
    switch (action) {
      case "code": {
        setCode((code) => data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };

  const handleCompile = async (input: any, output: any) => {
    setProcessing(true);
    setTestCaseInput(input);

    const formData = {
      language_id: language.id,
      expected_output: btoa(output),
      source_code: btoa(preProcessingCode + code + exeCode),
      stdin: btoa(input),
    };

    const token = await compile.getToken(formData);

    if (token) {
      await checkStatus(token);
    } else {
      showErrorToast(
        "Something went wrong on our end! Please try running your code again!"
      );
    }
  };

  // checking token status for single test case
  const checkStatus = async (token: any) => {
    console.log("token inside checkStatus", token);

    try {
      const data = await compile.checkTokenStatus(token);
      console.log("data", data);
      const statusId = data.statusId;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(data);
        showSuccessToast(`Compiled Successfully!`);
        return;
      }
    } catch (err) {
      setProcessing(false);
      console.log("err", err);
      showErrorToast();
    }
  };

  const handleCompileBatch = async () => {
    setProcessing(true);
    let formData = [];

    for (const testcase in testCaseInputs) {
      formData.push({
        language_id: language.id,
        expected_output: btoa(testCaseOutputs[testcase]),
        source_code: btoa(preProcessingCode + code + exeCode),
        stdin: btoa(testCaseInputs[testcase]),
      });
    }

    const token = await compile.getTokenBatch(formData);

    console.log("token", token);

    if (token) {
      checkStatusBatch(token);
    } else {
      showErrorToast(
        "Something went wrong on our end! Please try running your code again!"
      );
    }
  };

  const checkStatusBatch = async (token: any) => {
    try {
      const response = await compile.checkTokenStatusBatch(token);

      console.log("response", response);

      let lastInput = {};
      for (const result of response["submissions"]) {
        let statusId = result.status?.id;
        if (statusId === 1 || statusId === 2) {
          // still processing
          setTimeout(() => {
            checkStatusBatch(token);
          }, 2000);
          return;
        } else if (result.status["description"] !== "Accepted") {
          setProcessing(false);
          setOutputDetails(result);
          showErrorToast("Failed test case!");
          return;
        }
        lastInput = result;
      }
      setProcessing(false);
      setOutputDetails(lastInput);
      setCustomInput("Passed all test cases successfully!");
      showSuccessToast(`Passed all test cases successfully!`);
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  const markdown = `
  ## Reverse Linked List

  Given the head of a singly linked list, reverse the list, and return the reversed list.

  ### Example 1
  \`\`\`
  Input: head = [1,2,3,4,5]
  Output: [5,4,3,2,1]
  \`\`\`

  ### Example 2 
  \`\`\`
  Input: head = [5,6,3,5]
  Output: [5,3,6,5]
  \`\`\`

  ### Example 3 
  \`\`\`
  Input: head = []
  Output: []
  \`\`\`


  ### Constraints
  * The number of nodes in the list is in the range \`[0, 5 * 10^4]\`
        
  * The values of nodes in the list is in the range \`-5 * 10^4 <= Node.val <= 5 * 10^4\`
  
  ### Follow-up
  
  Solve the problem using both iterative and recursive approaches.
  

  

  


`;

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

  if (code === "") {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="">
        <Navbar />
        <div className="flex flex-row space-x-4 items-start  px-4 py-4 bg-[#f5f5f5] text-[#010101] dark:text-[#f5f5f5] dark:bg-[#14191e]">
          {/* <div className="flex w-screen flex-row">
          <div className="px-4 py-2">
            <LanguagesDropdown onSelectChange={onSelectChange} />
          </div>
          <div className="px-4 py-2">
            <ThemeDropdown
              handleThemeChange={handleThemeChange}
              theme={theme}
            />
          </div>
        </div> */}
          <div className="right-container flex  flex-shrink-0 w-2/5 flex-col">
            <div className="flex w-full ">
              <ReactMarkdown
                className="markdown  w-[99%] text-start"
                children={prompt}
                remarkPlugins={[remarkGfm]}
              />

              {/* <div className="h-screen border-2 py-0 my-0 border-[#1e293b] ml-4 " /> */}
            </div>
          </div>
          <div className="flex flex-col w-3/5 justify-start items-end">
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
              theme={typeof theme === "string" ? theme : theme.value}
              darkorlight={mode}
            />
            <div className="flex w-full ">
              <div className="flex flex-col w-3/4 overflow-auto ">
                <OutputWindow outputDetails={outputDetails} />
                {/* <div className="flex flex-col items-end">
                  <CustomInput
                    customInput={testCaseInput}
                    setCustomInput={setCustomInput}
                  />
                </div> */}
                {/* {outputDetails && (
                  <OutputDetails outputDetails={outputDetails} />
                )} */}
              </div>

              <div className="flex flex-col w-1/4 overflow-auto m-4 flex-grow">
                {inputs.map((input: any, index: number) => (
                  <button
                    onClick={() => handleCompile(input, outputs[index])}
                    disabled={!code || processing === true}
                    className={classnames(
                      "py-2.5 px-5 mr-2 mb-2 text-sm font-medium hover:opacity-80  focus:outline-none bg-[#0065f1] rounded-lg  border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 text-[#f5f5f5] dark:border-gray-600 dark:enabled:hover:text-white dark:enabled:hover:bg-gray-700 disabled:cursor-not-allowed",
                      !code || processing ? "bg-[#003cc9] disabled" : ""
                    )}
                  >
                    {`Test Case ${index + 1}`}
                  </button>
                ))}

                <button
                  onClick={handleCompileBatch}
                  disabled={!code || processing === true}
                  className={classnames(
                    "py-2.5  mt-auto px-5 mr-2 mb-2 text-sm font-medium hover:opacity-80  focus:outline-none bg-[#101010] text-[#f3f3f3] dark:bg-[#f3f3f3] rounded-lg border border-gray-200 enabled:hover:bg-gray-100 enabled:hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:text-[#010101] dark:border-gray-600 enabled:dark:hover:text-white enabled:dark:hover:bg-gray-700 disabled:cursor-not-allowed",
                    !code || processing ? "opacity-90 disabled" : ""
                  )}
                >
                  {"Submit"}
                </button>
              </div>
            </div>
          </div>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </div>
    );
  }
};
