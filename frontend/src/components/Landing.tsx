// Landing.js

import { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import "../index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { defineTheme } from "../lib/defineThemes";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";

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

  // Code related functions
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
  const handleCompile = (input: string, output: string) => {
    setProcessing(true);
    setTestCaseInput(input);
    const formData = {
      language_id: language.id,
      expected_output: btoa(output),
      source_code: btoa(preProcessingCode + code + exeCode),
      stdin: btoa(input),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        setProcessing(false);
        console.log(error);
      });
  };
  const checkStatus = async (token: any) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
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
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL_BATCH,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: { submissions: formData },
    };

    axios
      .request(options)
      .then(function (response) {
        let token = response.data.map((item: any) => item.token).join(",");
        checkStatusBatch(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        setProcessing(false);
        console.log(error);
      });
  };
  const checkStatusBatch = async (tokenStr: any) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL_BATCH,
      params: { tokens: tokenStr, base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let lastInput = {};
      for (const result of response.data["submissions"]) {
        let statusId = result.status?.id;
        if (statusId === 1 || statusId === 2) {
          // still processing
          setTimeout(() => {
            checkStatusBatch(tokenStr);
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
        <div className="h-16 w-full bg-gradient-to-r from-pink-500 via-blue-500 to-red-500"></div>
        <div className="flex flex-row">
          <div className="px-4 py-2">
            <LanguagesDropdown onSelectChange={onSelectChange} />
          </div>
          <div className="px-4 py-2">
            <ThemeDropdown
              handleThemeChange={handleThemeChange}
              theme={theme}
            />
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
              <CustomInput
                customInput={testCaseInput}
                setCustomInput={setCustomInput}
              />
              <button
                onClick={() =>
                  handleCompile(testCaseInputs[1], testCaseOutputs[1])
                }
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Test Case 1"}
              </button>
              <button
                onClick={() =>
                  handleCompile(testCaseInputs[2], testCaseOutputs[2])
                }
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Test Case 2"}
              </button>
              <button
                onClick={() =>
                  handleCompile(testCaseInputs[3], testCaseOutputs[3])
                }
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
