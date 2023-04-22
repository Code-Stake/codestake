// Landing.js

import { useEffect, useState } from "react";
import CodeEditorWindow from "./editor/CodeEditorWindow";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import "../index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineThemes";
import OutputWindow from "./editor/OutputWindow";
import CustomInput from "./editor/CustomInput";
import OutputDetails from "./editor/OutputDetails";
import ThemeDropdown from "./editor/ThemeDropdown";
import LanguagesDropdown from "./editor/LanguagesDropdown";
import axios from "axios";
import { compile } from "../api/compile";

type themeType = { value: string; label: string } | string;

const Landing = () => {
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

  const getQuestionContent = () => {
    axios.get("http://localhost:3001/api/question/content").then((response) => {
      setQuestionContents(response.data);
      setPreProcessingCode(response.data["preProcessingCode"]);
      setCode(response.data["starterCode"].trim());
      setExeCode(response.data["executionCode"]);
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
      showErrorToast("Something went wrong on our end! Please try running your code again!");
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

    if (token) {
      checkStatusBatch(token);
    } else {
      showErrorToast("Something went wrong on our end! Please try running your code again!");
    }
  };

  const checkStatusBatch = async (token: any) => {
    try {
      const response = await compile.checkTokenStatusBatch(token);

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

  if (code === "") {
    return <div>Loading...</div>;
  } else {
    return (
      <>
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
        <div className="flex w-screen flex-row">
          <div className="px-4 py-2">
            <LanguagesDropdown onSelectChange={onSelectChange} />
          </div>
          <div className="px-4 py-2">
            <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
          </div>
        </div>
        <div className="flex flex-row space-x-4 items-start px-4 py-4">
          <div className="flex flex-col w-1/2 h-3/4 bg-blue-500 justify-start items-end">
            <CodeEditorWindow
              code={code}
              onChange={onChange}
              language={language?.value}
              theme={typeof theme === "string" ? theme : theme.value}
            />
          </div>

          <div className="right-container flex flex-shrink-0 w-[30%] flex-col">
            <OutputWindow outputDetails={outputDetails} />
            <div className="flex flex-col items-end">
              <CustomInput customInput={testCaseInput} setCustomInput={setCustomInput} />
              <button
                onClick={() => handleCompile(testCaseInputs[1], testCaseOutputs[1])}
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Test Case 1"}
              </button>
              <button
                onClick={() => handleCompile(testCaseInputs[2], testCaseOutputs[2])}
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Test Case 2"}
              </button>
              <button
                onClick={() => handleCompile(testCaseInputs[3], testCaseOutputs[3])}
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Test Case 3"}
              </button>
              <button
                onClick={handleCompileBatch}
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Submit"}
              </button>
            </div>
            {outputDetails && <OutputDetails outputDetails={outputDetails} />}
          </div>
        </div>
        {/* <Footer /> */}
      </>
    );
  }
};
export default Landing;
