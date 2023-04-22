import axios from "axios";
import { useState } from "react";

// NODE_ENV = 'development'
// NODE_ENV = 'production'

//if we are in production baseurl = /api/v1/restaurants
// else baseurl = http://localhost:3001/api/v1/restaurants

// const baseURL = "http://localhost:3001/api/v1/restaurants";

// const baseURL =
//   process.env.NODE_ENV === "production"
//     ? "/api/"
//     : "http://localhost:3001/";

// export default axios.create({
//   baseURL,
// });



// const [customInput, setCustomInput] = useState("");
// const [outputDetails, setOutputDetails] = useState<any>(null);
// const [processing, setProcessing] = useState<boolean | null>(null);
// const [theme, setTheme] = useState<themeType>("cobalt");
// const [language, setLanguage] = useState(languageOptions[37]);

// //  Code related states
// const [questionContents, setQuestionContents] = useState<any>({});
// const [preProcessingCode, setPreProcessingCode] = useState<any>("");
// const [code, setCode] = useState("");
// const [testCaseInput, setTestCaseInput] = useState("[1,2,3,4]");
// const [testCaseOuput, setTestCaseOutput] = useState("[4, 3, 2, 1]");
// const [testCaseInputs, setTestCaseInputs] = useState<any>({});
// const [testCaseOutputs, setTestCaseOutputs] = useState<any>({});
// const [exeCode, setExeCode] = useState<any>("");


// const getQuestionContent = () => {
//     axios.get("http://localhost:3001/api/question/content").then((response) => {
//         setQuestionContents(response.data);
//         setPreProcessingCode(response.data["preProcessingCode"]);
//         setCode(response.data["starterCode"].trim());
//         setExeCode(response.data["executionCode"]);
//         setTestCaseInputs({
//         1: response.data["testCaseInput1"].trim(),
//         2: response.data["testCaseInput2"].trim(),
//         3: response.data["testCaseInput3"].trim(),
//         });
//         setTestCaseOutputs({
//         1: response.data["testCaseOutput1"].trim(),
//         2: response.data["testCaseOutput2"].trim(),
//         3: response.data["testCaseOutput3"].trim(),
//         });
//     });
//     };