// Landing.js

import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";
import "../index.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineThemes";
import useKeyPress from "../hooks/useKeyPress";
// import Footer from "./Footer";
import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import { app } from "../firebase";
import {
  getFirestore,
  doc,
  collection,
  getDocs,
  query,
} from "firebase/firestore";

// const javascriptDefault = `// some comment`;

type themeType = { value: string; label: string } | string;

type languages = {
  Python3: string;
  JS?: string;
  Java?: string;
};

type Questions = {
  prompt: string;
  starterCode: languages;
  config: string;
};

const QUESTIONS: { [key: string]: Questions } = {
  // LL: {
  //   prompt: "Reverse this Linked List",
  //   starterCode: {
  //     Python3:
  //       "def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:",
  //   },
  //   config: "
  //   ",
  // },
  // TREE: {},
  ARR: {
    prompt: "Reverse this Array",
    starterCode: {
      Python3: "def reverseArray(nums):",
    },
    config: "\nimport json\ns = input()\nprint(validParentheses(s))\n",
  },
  ARRwithINT: {
    prompt: "Two sum ",
    starterCode: {
      Python3: "def twoSum(nums: List[int], target: int) -> List[int]:",
    },
    config: `
  import json

  s = input()
  nums = json.loads(s.split()[0])
  target = int(s.split()[1])
`,
  },
};

const Landing = () => {
  const [code, setCode] = useState("");

  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [processing, setProcessing] = useState<boolean | null>(null);
  const [theme, setTheme] = useState<themeType>("cobalt");
  const [language, setLanguage] = useState(languageOptions[37]);
  const [input, setInput] = useState("");
  const db = getFirestore(app);

  // firebase consts
  const [questionData, setQuestionData] = useState({});
  const [testCaseInput, setTestCaseInput] = useState("");
  const [testCaseOuput, setTestCaseOutput] = useState("");
  const [prompt, setPrompt] = useState("");
  const [executionCode, setExecutionCode] = useState("");

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  useEffect(() => {
    getQuestionData();
  }, []);

  const onSelectChange = (sl: any) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  const getQuestionData = async () => {
    const q = query(collection(db, "solutions"));
    const querySnapshot = getDocs(q)
      .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
          console.log("doc.data()", doc.data());
          setQuestionData(doc.data());
          setCode(doc.data().starterCode.python3);
          console.log(doc.data().starterCode.python3);
          console.log(code);
          setTestCaseInput(doc.data().testCases[0].input);
          setTestCaseOutput(doc.data().testCases[0].output);
          setExecutionCode(doc.data().executionCode.replace(/\\n/g, "\n"));

          setPrompt(doc.data().prompt);
        });
      })
      .catch(function (error) {
        console.log("Error getting documents: ", error);
      });
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      // handleCompile();
    }
  }, [ctrlPress, enterPress]);
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

  console.log(code);
  let configCode = code + executionCode;
  console.log(configCode);

  const handleCompile = () => {
    setProcessing(true);
    const formData = {
      language_id: language.id,
      // encode source code in base64
      expected_output: btoa(testCaseOuput),
      source_code: btoa(configCode),
      stdin: btoa(testCaseInput),
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
        console.log("res.data", response.data);
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
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th: any) {
    // We will come to the implementation later in the code
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

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

  console.log(code);

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
                onClick={handleCompile}
                disabled={!code}
                className={classnames(
                  "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
                  !code ? "opacity-50" : ""
                )}
              >
                {processing ? "Processing..." : "Compile and Execute"}
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
