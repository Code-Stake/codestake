// CodeEditorWindow.js

import React, { useEffect, useState } from "react";

import Editor from "@monaco-editor/react";

type Params = {
  onChange: any; //need to change onChange's type
  language: string;
  code: string;
  theme: string;
  darkorlight: string;
};

const CodeEditorWindow = ({
  onChange,
  language,
  code,
  theme,
  darkorlight,
}: Params) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value: any) => {
    //need to change value's type
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full shadow-4xl">
      <Editor
        height="60vh"
        width={`100%`}
        language={language || "python"}
        options={{
          minimap: {
            enabled: false,
          },
          quickSuggestions: {
            other: false,
            comments: false,
            strings: false,
          },
        }}
        value={value}
        theme={darkorlight === "dark" ? "vs-dark" : "vs-light"}
        defaultValue={code}
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
